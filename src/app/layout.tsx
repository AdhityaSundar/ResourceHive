import type { Metadata } from "next";
import { Fraunces, Public_Sans } from "next/font/google";

import { AppProviders } from "@/components/providers/app-providers";
import { SiteShell } from "@/components/site/site-shell";

import "./globals.css";

// Display: Fraunces — a warm, soft old-style serif with optical sizing.
// The SOFT axis rounds terminals for a more human, welcoming feel.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

// Body/UI: Public Sans — the USWDS accessibility-first workhorse.
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
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
      className={`${fraunces.variable} ${publicSans.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full font-sans" suppressHydrationWarning>
        <AppProviders>
          <SiteShell>{children}</SiteShell>
        </AppProviders>
      </body>
    </html>
  );
}
