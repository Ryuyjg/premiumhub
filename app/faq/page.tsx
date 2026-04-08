import { notFound } from "next/navigation";
import { SitePageView } from "@/components/content/site-page-view";
import { getSitePage } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const page = await getSitePage("faq");

  if (!page) {
    notFound();
  }

  return <SitePageView page={page} />;
}
