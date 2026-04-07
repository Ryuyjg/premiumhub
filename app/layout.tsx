import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { AppProviders } from "@/components/providers/app-providers";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SupportFloat } from "@/components/navigation/support-float";
import { CommandPalette } from "@/components/navigation/command-palette";
import { MobileNav } from "@/components/navigation/mobile-nav";
import { LivePurchaseToast } from "@/components/marketing/live-purchase-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: `${APP_NAME} — Premium OTT Subscriptions`,
    template: `%s | ${APP_NAME}`
  },
  description: APP_DESCRIPTION,
  keywords: ["OTT subscriptions", "Netflix", "Disney+", "Prime Video", "streaming", "India"],
  openGraph: {
    title: `${APP_NAME} — Premium OTT Subscriptions`,
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
      <body className={`${inter.variable} ${jakarta.variable} font-sans`}>
        <AppProviders>
          <SiteHeader />
          <CommandPalette />
          <main className="min-h-screen">{children}</main>
          <SupportFloat />
          <MobileNav />
          <LivePurchaseToast />
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
