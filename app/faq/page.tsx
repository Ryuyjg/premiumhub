import { SitePageView } from "@/components/content/site-page-view";
import { getSitePageOrDefault } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const page = await getSitePageOrDefault("faq");

  return <SitePageView page={page} />;
}
