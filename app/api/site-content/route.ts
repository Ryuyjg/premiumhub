import { NextResponse } from "next/server";
import { getPublicSiteContent } from "@/lib/site-content";

export const dynamic = "force-static";

export async function GET() {
  const content = await getPublicSiteContent();
  return NextResponse.json(content);
}
