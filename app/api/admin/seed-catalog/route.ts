import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { STARTER_CATEGORIES, STARTER_PRODUCTS } from "@/lib/starter-catalog";
import { slugify } from "@/lib/utils";

export async function POST() {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const categoryIdBySlug = new Map<string, string>();
  const categoryNameBySlug = new Map<string, string>();
  let categoriesCreated = 0;
  let productsCreated = 0;
  let productsSkipped = 0;

  for (const category of STARTER_CATEGORIES) {
    const slug = slugify(category.name);
    const existing = await adminDb.collection("categories").where("slug", "==", slug).limit(1).get();

    if (!existing.empty) {
      categoryIdBySlug.set(slug, existing.docs[0].id);
      categoryNameBySlug.set(slug, String(existing.docs[0].data().name || category.name));
      continue;
    }

    const ref = await adminDb.collection("categories").add({
      name: category.name,
      slug,
      description: category.description
    });

    categoriesCreated += 1;
    categoryIdBySlug.set(slug, ref.id);
    categoryNameBySlug.set(slug, category.name);
  }

  const now = new Date().toISOString();

  for (const product of STARTER_PRODUCTS) {
    const categorySlug = slugify(product.categoryName);
    const categoryId = categoryIdBySlug.get(categorySlug);
    const categoryName = categoryNameBySlug.get(categorySlug) || product.categoryName;

    if (!categoryId) {
      productsSkipped += 1;
      continue;
    }

    const slug = slugify(product.name);
    const existing = await adminDb.collection("products").where("slug", "==", slug).limit(1).get();
    if (!existing.empty) {
      productsSkipped += 1;
      continue;
    }

    const salePrice = product.salePrice && product.salePrice > 0 ? product.salePrice : null;
    const discount =
      salePrice && salePrice < product.price
        ? Math.round(((product.price - salePrice) / product.price) * 100)
        : 0;

    await adminDb.collection("products").add({
      name: product.name,
      slug,
      shortDescription: product.description.slice(0, 120),
      description: product.description,
      price: product.price,
      salePrice,
      discount,
      categoryId,
      categoryName,
      durationInDays: product.durationInDays,
      imageUrls: [product.imageUrl],
      features: product.features || ["Fast delivery", "Secure checkout", "Support included"],
      featured: Boolean(product.featured),
      bestSelling: Boolean(product.bestSelling),
      deliveryMode: product.deliveryMode || "email_invite",
      otpSupportNumber: null,
      deliveryNotes: null,
      stockStatus: "active",
      createdAt: now,
      updatedAt: now
    });

    productsCreated += 1;
  }

  return NextResponse.json({
    success: true,
    categoriesCreated,
    productsCreated,
    productsSkipped
  });
}
