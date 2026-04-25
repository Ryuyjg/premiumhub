import { SitePageView } from "@/components/content/site-page-view";
import { getSitePageOrDefault } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function RefundPolicyPage() {
  const page = await getSitePageOrDefault("refund-policy");

  return <SitePageView page={page} />;
}
