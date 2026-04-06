import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  description: z.string().min(8),
  price: z.coerce.number().positive(),
  discount: z.coerce.number().min(0).max(99).optional(),
  categoryId: z.string().min(1),
  imageUrl: z.string().min(1),
  bestSelling: z.boolean().optional(),
  deliveryMode: z.enum(["direct_credentials", "otp_manual", "email_invite"]).optional(),
  otpSupportNumber: z.string().optional(),
  deliveryNotes: z.string().optional(),
  stockStatus: z.enum(["active", "draft", "archived"]).optional()
});

async function buildProductPayload(parsed: z.infer<typeof productSchema>) {
  const categoryDoc = await adminDb.collection("categories").doc(parsed.categoryId).get();
  if (!categoryDoc.exists) {
    throw new Error("Selected category does not exist.");
  }

  const category = categoryDoc.data()!;
  const discount = Number(parsed.discount || 0);
  const salePrice = discount > 0 ? Math.max(Math.round(parsed.price * (1 - discount / 100)), 1) : undefined;

  return {
    name: parsed.name,
    slug: slugify(parsed.name),
    shortDescription: parsed.description.slice(0, 120),
    description: parsed.description,
    price: parsed.price,
    salePrice,
    discount,
    categoryId: parsed.categoryId,
    categoryName: String(category.name || ""),
    durationInDays: 30,
    imageUrls: [parsed.imageUrl],
    features: ["Instant activation", "Secure payment verification", "Priority support"],
    featured: false,
    bestSelling: Boolean(parsed.bestSelling),
    deliveryMode: parsed.deliveryMode || "direct_credentials",
    otpSupportNumber: (parsed.otpSupportNumber || "").trim() || null,
    deliveryNotes: (parsed.deliveryNotes || "").trim() || null,
    stockStatus: parsed.stockStatus || "active",
    updatedAt: new Date().toISOString()
  };
}

export async function POST(request: Request) {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const parsed = productSchema.parse(await request.json());
    const payload = await buildProductPayload(parsed);
    const ref = await adminDb.collection("products").add({
      ...payload,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ id: ref.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create product." },
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
    const parsed = productSchema.extend({ id: z.string() }).parse(await request.json());
    const payload = await buildProductPayload(parsed);
    await adminDb.collection("products").doc(parsed.id).update(payload);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update product." },
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
    return NextResponse.json({ error: "Missing product id." }, { status: 400 });
  }
  await adminDb.collection("products").doc(id).delete();
  return NextResponse.json({ success: true });
}
