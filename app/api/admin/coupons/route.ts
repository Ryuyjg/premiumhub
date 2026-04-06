import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";

const couponSchema = z.object({
  code: z.string().min(3).transform((value) => value.toUpperCase()),
  type: z.enum(["flat", "percent"]),
  value: z.number().positive(),
  usageLimit: z.number().int().positive(),
  expiresAt: z.string(),
  active: z.boolean()
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const parsed = couponSchema.parse(await request.json());
  const ref = await adminDb.collection("coupons").add({
    ...parsed,
    usedCount: 0
  });
  return NextResponse.json({ id: ref.id });
}
