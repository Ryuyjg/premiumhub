import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";

const supportChannelSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2),
  description: z.string().min(2),
  href: z.string().min(1),
  buttonLabel: z.string().min(2),
  order: z.coerce.number().int().min(0).default(0),
  active: z.boolean().default(true)
});

const reorderSchema = z.object({
  updates: z
    .array(
      z.object({
        id: z.string().min(1),
        order: z.coerce.number().int().min(0)
      })
    )
    .min(1)
});

export async function POST(request: Request) {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const parsed = supportChannelSchema.parse(await request.json());
    const timestamp = new Date().toISOString();

    const ref = await adminDb.collection("supportChannels").add({
      title: parsed.title.trim(),
      description: parsed.description.trim(),
      href: parsed.href.trim(),
      buttonLabel: parsed.buttonLabel.trim(),
      order: parsed.order,
      active: parsed.active,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    return NextResponse.json({ id: ref.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create support channel." },
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
    const parsed = supportChannelSchema.extend({ id: z.string().min(1) }).parse(await request.json());
    const timestamp = new Date().toISOString();

    await adminDb.collection("supportChannels").doc(parsed.id).set(
      {
        title: parsed.title.trim(),
        description: parsed.description.trim(),
        href: parsed.href.trim(),
        buttonLabel: parsed.buttonLabel.trim(),
        order: parsed.order,
        active: parsed.active,
        updatedAt: timestamp
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update support channel." },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const parsed = reorderSchema.parse(await request.json());
    const batch = adminDb.batch();
    const timestamp = new Date().toISOString();

    parsed.updates.forEach((item) => {
      batch.set(
        adminDb.collection("supportChannels").doc(item.id),
        { order: item.order, updatedAt: timestamp },
        { merge: true }
      );
    });

    await batch.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to reorder support channels." },
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
  const id = String(searchParams.get("id") || "").trim();

  if (!id) {
    return NextResponse.json({ error: "Missing support channel id." }, { status: 400 });
  }

  await adminDb.collection("supportChannels").doc(id).delete();
  return NextResponse.json({ success: true });
}
