import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).optional()
});

export async function POST(request: Request) {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const parsed = categorySchema.parse(await request.json());
    const slug = slugify(parsed.name);
    const timestamp = new Date().toISOString();
    const orderSnapshot = await adminDb.collection("categories").get();
    const nextOrder =
      orderSnapshot.docs.reduce((max, doc) => Math.max(max, Number(doc.data().order ?? -1)), -1) + 1;

    const duplicate = await adminDb.collection("categories").where("slug", "==", slug).limit(1).get();
    if (!duplicate.empty) {
      return NextResponse.json({ error: "Category already exists." }, { status: 409 });
    }

    const ref = await adminDb.collection("categories").add({
      name: parsed.name,
      slug,
      description: parsed.description || "",
      imageUrl: parsed.imageUrl || "",
      order: parsed.order ?? nextOrder,
      createdAt: timestamp,
      updatedAt: timestamp
    });

    return NextResponse.json({ id: ref.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create category." },
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
    const body = (await request.json()) as Record<string, unknown>;
    const id = String(body.id || "").trim();
    if (!id) {
      return NextResponse.json({ error: "Missing category id." }, { status: 400 });
    }

    const parsed = categorySchema.parse(body);
    const slug = slugify(parsed.name);
    const timestamp = new Date().toISOString();
    const categoryRef = adminDb.collection("categories").doc(id);

    const [categoryDoc, duplicate] = await Promise.all([
      categoryRef.get(),
      adminDb.collection("categories").where("slug", "==", slug).limit(1).get()
    ]);

    if (!categoryDoc.exists) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    if (!duplicate.empty && duplicate.docs[0].id !== id) {
      return NextResponse.json({ error: "Another category already uses that name." }, { status: 409 });
    }

    await categoryRef.set(
      {
        name: parsed.name,
        slug,
        description: parsed.description || "",
        imageUrl: parsed.imageUrl || "",
        ...(parsed.order !== undefined ? { order: parsed.order } : {}),
        updatedAt: timestamp
      },
      { merge: true }
    );

    const linkedProducts = await adminDb.collection("products").where("categoryId", "==", id).get();
    if (!linkedProducts.empty) {
      const batch = adminDb.batch();
      linkedProducts.docs.forEach((doc) => {
        batch.update(doc.ref, {
          categoryName: parsed.name,
          updatedAt: timestamp
        });
      });
      await batch.commit();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update category." },
      { status: 400 }
    );
  }
}

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
      const ref = adminDb.collection("categories").doc(item.id);
      batch.set(
        ref,
        {
          order: item.order,
          updatedAt: timestamp
        },
        { merge: true }
      );
    });

    await batch.commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to reorder categories." },
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
