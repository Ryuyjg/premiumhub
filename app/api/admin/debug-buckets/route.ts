import { NextResponse } from "next/server";
import { adminStorage } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const [buckets] = await adminStorage.getBuckets();
    return NextResponse.json({
      buckets: buckets.map((b) => b.name)
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
