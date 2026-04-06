import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  accent: z.string().optional()
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const parsed = categorySchema.parse(await request.json());
  const ref = await adminDb.collection("categories").add({
    ...parsed,
    slug: slugify(parsed.name)
  });

  return NextResponse.json({ id: ref.id });
}

export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing category id." }, { status: 400 });
  }

  const categoryRef = adminDb.collection("categories").doc(id);
  const [categoryDoc, linkedProducts] = await Promise.all([
    categoryRef.get(),
    adminDb.collection("products").where("categoryId", "==", id).get()
  ]);

  if (!categoryDoc.exists) {
    return NextResponse.json({ error: "Category not found." }, { status: 404 });
  }

  if (!linkedProducts.empty) {
    return NextResponse.json(
      {
        error: `This category is assigned to ${linkedProducts.size} product${linkedProducts.size === 1 ? "" : "s"}. Move or delete those products first.`
      },
      { status: 409 }
    );
  }

  await categoryRef.delete();
  return NextResponse.json({ success: true });
}
