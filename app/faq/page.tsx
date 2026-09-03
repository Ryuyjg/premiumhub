import { SitePageView } from "@/components/content/site-page-view";
import { getSitePageOrDefault } from "@/lib/site-content";

export const dynamic = "force-static";

export default async function FaqPage() {
  const page = await getSitePageOrDefault("faq");

  return <SitePageView page={page} />;
}
