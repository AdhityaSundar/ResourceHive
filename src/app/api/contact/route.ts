import { NextResponse } from "next/server";
import { z } from "zod";

import { CONTACT_EMAIL } from "@/lib/contact";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  organization: z.string().trim().max(160).optional(),
  message: z.string().trim().min(1).max(4000),
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const parsed = contactSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { code: "invalid_request", message: "Please complete the contact form." },
      { status: 400 },
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return NextResponse.json(
      { code: "missing_config", message: "Email delivery is not configured." },
      { status: 503 },
    );
  }

  const to = process.env.CONTACT_EMAIL_TO ?? CONTACT_EMAIL;
  const from = process.env.CONTACT_EMAIL_FROM ?? "ResourceHive <onboarding@resend.dev>";
  const organization = parsed.data.organization || "Not provided";
  const subject = `ResourceHive contact: ${parsed.data.name}`;
  const text = [
    "New ResourceHive contact message",
    "",
    `Name: ${parsed.data.name}`,
    `Email: ${parsed.data.email}`,
    `Organization: ${organization}`,
    "",
    parsed.data.message,
  ].join("\n");
  const html = `
    <h2>New ResourceHive contact message</h2>
    <p><strong>Name:</strong> ${escapeHtml(parsed.data.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(parsed.data.email)}</p>
    <p><strong>Organization:</strong> ${escapeHtml(organization)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(parsed.data.message).replace(/\n/g, "<br />")}</p>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      html,
      reply_to: parsed.data.email,
    }),
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const serviceMessage =
      typeof data?.message === "string" ? data.message : "Email service rejected the message.";
    const code =
      response.status === 401
        ? "invalid_api_key"
        : /domain|verify|testing|own email/i.test(serviceMessage)
          ? "sender_not_verified"
          : "send_failed";

    return NextResponse.json(
      {
        code,
        message: serviceMessage,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ id: data?.id ?? null });
}
