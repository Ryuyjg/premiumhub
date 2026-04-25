import { SitePageView } from "@/components/content/site-page-view";
import { getSitePageOrDefault } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const page = await getSitePageOrDefault("terms");

  return <SitePageView page={page} />;
}
