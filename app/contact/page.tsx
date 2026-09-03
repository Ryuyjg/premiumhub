import { SitePageView } from "@/components/content/site-page-view";
import { getSitePageOrDefault, getSupportChannelsOrDefault } from "@/lib/site-content";
import { normalizeSupportHref } from "@/lib/url-normalize";
import type { SupportChannel } from "@/types";

export const dynamic = "force-static";

export default async function ContactPage() {
  const [page, supportChannels] = await Promise.all([getSitePageOrDefault("contact"), getSupportChannelsOrDefault()]);

  const preferred = supportChannels
    .filter((channel) => {
      const combined = `${channel.title} ${channel.href}`.toLowerCase();
      return combined.includes("telegram") || combined.includes("t.me") || combined.includes("whatsapp") || combined.includes("wa.me");
    })
    .map((channel) => ({ ...channel, href: normalizeSupportHref(channel.href) }));

  const fallback: SupportChannel[] = [
    {
      id: "fallback-telegram",
      title: "Telegram",
      description: "Chat with us on Telegram for quick support.",
      href: "https://t.me/ogdigital",
      buttonLabel: "Open Telegram",
      order: 0,
      active: true,
      createdAt: "",
      updatedAt: ""
    },
    {
      id: "fallback-whatsapp",
      title: "WhatsApp",
      description: "Message us directly on WhatsApp.",
      href: "https://wa.me/917907102615",
      buttonLabel: "Open WhatsApp",
      order: 1,
      active: true,
      createdAt: "",
      updatedAt: ""
    }
  ];

  return <SitePageView page={page} supportChannels={preferred.length ? preferred : fallback} />;
}
