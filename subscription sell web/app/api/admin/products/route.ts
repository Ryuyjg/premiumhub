import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { slugify } from "@/lib/utils";

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3),
  shortDescription: z.string().min(12),
  description: z.string().min(20),
  price: z.number().positive(),
  salePrice: z.number().positive().optional(),
  categoryId: z.string().min(1),
  categoryName: z.string().min(1),
  durationInDays: z.number().int().positive(),
  imageUrls: z.array(z.string().url()).min(1),
  features: z.array(z.string()).min(1),
  featured: z.boolean().optional(),
  stockStatus: z.enum(["active", "draft", "archived"])
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const parsed = productSchema.parse(await request.json());
  const ref = await adminDb.collection("products").add({
    ...parsed,
    slug: slugify(parsed.name),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  return NextResponse.json({ id: ref.id });
}

export async function PUT(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const parsed = productSchema.extend({ id: z.string() }).parse(await request.json());
  await adminDb.collection("products").doc(parsed.id).update({
    ...parsed,
    slug: slugify(parsed.name),
    updatedAt: new Date().toISOString()
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
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
