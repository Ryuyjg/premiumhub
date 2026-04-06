import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional()
});

export async function POST(request: Request) {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const parsed = categorySchema.parse(await request.json());
    const slug = slugify(parsed.name);

    const duplicate = await adminDb.collection("categories").where("slug", "==", slug).limit(1).get();
    if (!duplicate.empty) {
      return NextResponse.json({ error: "Category already exists." }, { status: 409 });
    }

    const ref = await adminDb.collection("categories").add({
      ...parsed,
      slug
    });

    return NextResponse.json({ id: ref.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create category." },
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
