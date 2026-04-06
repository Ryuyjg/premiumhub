import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";

const createReviewSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(2),
  rating: z.coerce.number().int().min(1).max(5),
  message: z.string().min(8),
  active: z.boolean().optional()
});

const updateReviewSchema = z.object({
  id: z.string().min(1),
  active: z.boolean().optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  message: z.string().min(8).optional()
});

export async function GET() {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const snapshot = await adminDb.collection("reviews").orderBy("createdAt", "desc").limit(100).get();
  const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const parsed = createReviewSchema.parse(await request.json());
    const ref = await adminDb.collection("reviews").add({
      ...parsed,
      active: parsed.active ?? true,
      createdAt: new Date().toISOString()
    });
    return NextResponse.json({ id: ref.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create review." },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const parsed = updateReviewSchema.parse(await request.json());
    const payload: Record<string, unknown> = { updatedAt: new Date().toISOString() };
    if (parsed.active !== undefined) payload.active = parsed.active;
    if (parsed.rating !== undefined) payload.rating = parsed.rating;
    if (parsed.message !== undefined) payload.message = parsed.message;
    await adminDb.collection("reviews").doc(parsed.id).update(payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update review." },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing review id." }, { status: 400 });
  }
  await adminDb.collection("reviews").doc(id).delete();
  return NextResponse.json({ success: true });
}
