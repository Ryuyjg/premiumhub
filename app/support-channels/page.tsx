import { notFound } from "next/navigation";
import { SitePageView } from "@/components/content/site-page-view";
import { getSitePage, getSupportChannels } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function SupportChannelsPage() {
  const [page, supportChannels] = await Promise.all([getSitePage("support-channels"), getSupportChannels()]);

  if (!page) {
    notFound();
  }

  return <SitePageView page={page} supportChannels={supportChannels} />;
}
