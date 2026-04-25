import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { AppProviders } from "@/components/providers/app-providers";
import { AppShell } from "@/components/navigation/app-shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
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
  other: {
    heleket: "e122e7a0"
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans`}>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
