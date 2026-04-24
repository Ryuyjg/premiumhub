import { SitePageView } from "@/components/content/site-page-view";
import { getSitePage, getSupportChannels } from "@/lib/site-content";
import type { SitePage, SupportChannel } from "@/types";

export const dynamic = "force-dynamic";

export default async function SupportChannelsPage() {
  const fallbackPage: SitePage = {
    id: "support-channels",
    slug: "support-channels",
    label: "Support channels",
    footerGroup: "company",
    order: 3,
    eyebrow: "Support",
    title: "Support channels",
    description: "Choose any active support channel below.",
    body: "",
    layout: "cards",
    showSupportChannels: true,
    sections: [],
    createdAt: "",
    updatedAt: ""
  };

  const fallbackChannels: SupportChannel[] = [
    {
      id: "fallback-whatsapp",
      title: "WhatsApp",
      description: "Message support directly on WhatsApp.",
      href: "https://wa.me/917907102615",
      buttonLabel: "Open WhatsApp",
      order: 0,
      active: true,
      createdAt: "",
      updatedAt: ""
    },
    {
      id: "fallback-telegram",
      title: "Telegram",
      description: "Message @ogdigital on Telegram.",
      href: "https://t.me/ogdigital",
      buttonLabel: "Open Telegram",
      order: 1,
      active: true,
      createdAt: "",
      updatedAt: ""
    }
  ];

  let page: SitePage | null = null;
  let supportChannels: SupportChannel[] = [];

  try {
    [page, supportChannels] = await Promise.all([getSitePage("support-channels"), getSupportChannels()]);
  } catch {
    // Fail-safe fallback so support page never crashes for customers.
  }

  return (
    <SitePageView
      page={page || fallbackPage}
      supportChannels={supportChannels.length ? supportChannels : fallbackChannels}
    />
  );
}
