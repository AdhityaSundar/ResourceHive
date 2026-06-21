import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import { SiteShell } from "@/components/site/site-shell";

import "./globals.css";

// Display: Bricolage Grotesque — a warm, characterful contemporary grotesque.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

// Body/UI: Plus Jakarta Sans — a clean, friendly geometric sans.
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ResourceHive",
  description:
    "ResourceHive connects communities to trusted local help across food, shelter, jobs, healthcare, education, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${bricolage.variable} ${jakarta.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full font-sans" suppressHydrationWarning>
        <AppProviders>
          <SiteShell>{children}</SiteShell>
        </AppProviders>
      </body>
    </html>
  );
}
