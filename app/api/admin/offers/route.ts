import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthorized } from "@/lib/auth";
import { resolveOfferTheme } from "@/lib/offer-themes";
import { adminDb } from "@/lib/firebase/admin";

const offerSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  description: z.string().min(3),
  badge: z.string().optional(),
  accent: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().optional(),
  active: z.boolean().optional(),
  order: z.coerce.number().min(0).optional()
});

function buildPayload(parsed: z.infer<typeof offerSchema>) {
  return {
    title: parsed.title.trim(),
    description: parsed.description.trim(),
    badge: (parsed.badge || "").trim(),
    accent: resolveOfferTheme(parsed.accent).id,
    ctaLabel: (parsed.ctaLabel || "").trim(),
    ctaUrl: (parsed.ctaUrl || "").trim(),
    active: parsed.active !== false,
    order: Number(parsed.order || 0),
    updatedAt: new Date().toISOString()
  };
}

export async function POST(request: Request) {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const parsed = offerSchema.parse(await request.json());
    const payload = buildPayload(parsed);
    const ref = await adminDb.collection("offers").add({
      ...payload,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ id: ref.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create offer." }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const parsed = offerSchema.extend({ id: z.string() }).parse(await request.json());
    const payload = buildPayload(parsed);
    await adminDb.collection("offers").doc(parsed.id).update(payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update offer." }, { status: 400 });
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
    return NextResponse.json({ error: "Missing offer id." }, { status: 400 });
  }

  await adminDb.collection("offers").doc(id).delete();
  return NextResponse.json({ success: true });
}
