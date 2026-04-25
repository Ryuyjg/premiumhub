import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const heleketToken = new URL(request.url).pathname.split("/").pop()?.replace(/\.html$/, "") || "";

  if (!heleketToken.startsWith("heleket_")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const token = heleketToken.replace(/^heleket_/, "");
  return new Response(`heleket=${token}`, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=60"
    }
  });
}
