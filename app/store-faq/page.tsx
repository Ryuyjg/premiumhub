import { SitePageView } from "@/components/content/site-page-view";
import { getSitePageOrDefault } from "@/lib/site-content";

export const dynamic = "force-static";

export default async function StoreFaqPage() {
  const page = await getSitePageOrDefault("store-faq");

  return <SitePageView page={page} />;
}
