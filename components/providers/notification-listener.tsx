"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";

type NotificationPayload = {
  id: string;
  title: string;
  message: string;
  read: boolean;
};

export function NotificationListener() {
  const { user } = useAuth();
  const seenIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      return;
    }

    let timer: ReturnType<typeof setInterval> | null = null;

    const fetchNotifications = async () => {
      const response = await fetch("/api/notifications", { cache: "no-store" });
      if (!response.ok) {
        return;
      }
      const notifications = (await response.json()) as NotificationPayload[];
      let hasNewUnread = false;
      notifications.forEach((notification) => {
        if (!seenIds.current.has(notification.id)) {
          seenIds.current.add(notification.id);
          if (!notification.read) {
            hasNewUnread = true;
            toast(notification.title, {
              description: notification.message
            });
          }
        }
      });

      if (hasNewUnread) {
        await fetch("/api/notifications", { method: "PATCH" });
      }
    };

    fetchNotifications().catch(() => {});
    timer = setInterval(() => fetchNotifications().catch(() => {}), 30000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [user]);

  return null;
}
