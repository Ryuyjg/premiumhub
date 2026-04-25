import { SitePageView } from "@/components/content/site-page-view";
import { getSitePageOrDefault } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const page = await getSitePageOrDefault("about");

  return <SitePageView page={page} />;
}
