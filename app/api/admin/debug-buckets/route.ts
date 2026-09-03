import { NextResponse } from "next/server";

export const dynamic = "force-static";
import { adminStorage } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const bucket = adminStorage.bucket();
    return NextResponse.json({
      buckets: [bucket.name]
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
