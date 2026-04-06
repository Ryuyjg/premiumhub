"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import { NotificationListener } from "@/components/providers/notification-listener";

type Props = {
  children: React.ReactNode;
};

export function AppProviders({ children }: Props) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <NotificationListener />
        {children}
      </AuthProvider>
      <Toaster richColors position="top-right" />
    </ThemeProvider>
  );
}
