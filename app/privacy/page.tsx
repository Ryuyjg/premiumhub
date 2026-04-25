import { SitePageView } from "@/components/content/site-page-view";
import { getSitePageOrDefault } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const page = await getSitePageOrDefault("privacy");

  return <SitePageView page={page} />;
}
