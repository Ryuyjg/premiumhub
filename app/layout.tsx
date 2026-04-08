import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SupportFloat } from "@/components/navigation/support-float";
import { CommandPalette } from "@/components/navigation/command-palette";
import { MobileNav } from "@/components/navigation/mobile-nav";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: `${APP_NAME} | Curated digital access`,
    template: `%s | ${APP_NAME}`
  },
  description: APP_DESCRIPTION,
  keywords: [
    APP_NAME,
    "digital products",
    "software licenses",
    "subscription marketplace",
    "manual catalog",
    "secure customer dashboard"
  ],
  openGraph: {
    title: `${APP_NAME} | Curated digital access`,
    description: APP_DESCRIPTION,
    type: "website",
    siteName: APP_NAME
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${spaceGrotesk.variable} font-sans`}>
        <AppProviders>
          <SiteHeader />
          <CommandPalette />
          <main className="min-h-screen">{children}</main>
          <SupportFloat />
          <MobileNav />
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
