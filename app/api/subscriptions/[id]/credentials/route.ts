import { NextResponse } from "next/server";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return [{ id: "demo" }];
}

export async function GET() {
  return NextResponse.json({ error: "Static export mode" });
}
