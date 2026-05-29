import type { Metadata } from "next";

import { AppProviders } from "@/components/providers/app-providers";
import { SiteShell } from "@/components/site/site-shell";

import "./globals.css";

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
    <html lang="en" suppressHydrationWarning className="h-full scroll-smooth antialiased">
      <body className="min-h-full font-sans" suppressHydrationWarning>
        <AppProviders>
          <SiteShell>{children}</SiteShell>
        </AppProviders>
      </body>
    </html>
  );
}
