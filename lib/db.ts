import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { FEATURED_CATEGORY_SLUG, STARTER_CATEGORIES, sortCategories } from "@/lib/catalog";
import { buildCatalogSeed } from "@/lib/catalog-seed";
import type {
  AppUser,
  AnalyticsSummary,
  Category,
  Coupon,
  Offer,
  Order,
  OttAccount,
  Product,
  Review,
  SupportTicket,
  Subscription
} from "@/types";
import { slugify } from "@/lib/utils";

function withId<T>(id: string, data: any) {
  return { id, ...data } as T;
}

let starterCatalogSeedPromise: Promise<void> | null = null;

async function getDirectStockSeatMap() {
  const snapshot = await adminDb.collection("ottAccounts").where("status", "!=", "disabled").get();
  const seatMap = new Map<string, number>();

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const productId = String(data.productId || "");
    if (!productId) {
      return;
    }
    const remaining = Math.max(Number(data.maxUsers || 0) - Number(data.activeUsers || 0), 0);
    seatMap.set(productId, (seatMap.get(productId) || 0) + remaining);
  });

  return seatMap;
}

function withDeliveryAndStock(product: Product, seatMap: Map<string, number>): Product {
  const deliveryMode = product.deliveryMode || "direct_credentials";
  const isOutOfStock = deliveryMode === "direct_credentials" && (seatMap.get(product.id) || 0) <= 0;
  const firstValidImage = (product.imageUrls || []).find((url) => typeof url === "string" && url.trim().length > 0);
  const fallbackSeed = slugify(product.slug || product.name || product.id || "product-image");
  const imageUrls = firstValidImage
    ? [firstValidImage, ...(product.imageUrls || []).filter((url) => typeof url === "string" && url.trim().length > 0 && url !== firstValidImage)]
    : [`https://picsum.photos/seed/${fallbackSeed}/1600/900`];

  return {
    ...product,
    shortDescription: product.shortDescription || String(product.description || "").slice(0, 120),
    durationInDays: Number(product.durationInDays || 30),
    features:
      Array.isArray(product.features) && product.features.length
        ? product.features
        : ["Instant activation", "Secure payment verification", "Priority support"],
    featured: Boolean(product.featured),
    bestSelling: Boolean(product.bestSelling),
    imageUrls,
    deliveryMode,
    otpSupportNumber: product.otpSupportNumber || "",
    deliveryNotes: product.deliveryNotes || "",
    isOutOfStock
  };
}

function dedupeProducts(items: Product[]) {
  const byKey = new Map<string, Product>();

  for (const item of items) {
    const key = slugify(item.slug || item.name || item.id);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, item);
      continue;
    }

    const existingHasImage = Boolean(existing.imageUrls?.[0]);
    const nextHasImage = Boolean(item.imageUrls?.[0]);
    if (!existingHasImage && nextHasImage) {
      byKey.set(key, item);
      continue;
    }
    if (existingHasImage && !nextHasImage) {
      continue;
    }

    const existingTime = Date.parse(String(existing.updatedAt || existing.createdAt || 0));
    const nextTime = Date.parse(String(item.updatedAt || item.createdAt || 0));
    if (Number.isFinite(nextTime) && nextTime > existingTime) {
      byKey.set(key, item);
    }
  }

  return Array.from(byKey.values());
}

async function ensureStarterCategories(categories: Category[]) {
  const existingSlugs = new Set(categories.map((category) => slugify(category.slug || category.name || category.id)));
  const missing = STARTER_CATEGORIES.filter((category) => !existingSlugs.has(category.slug));

  if (!missing.length) {
    return categories;
  }

  const timestamp = new Date().toISOString();
  const batch = adminDb.batch();

  missing.forEach((category) => {
    const ref = adminDb.collection("categories").doc(category.slug);
    batch.set(
      ref,
      {
        name: category.name,
        slug: category.slug,
        order: category.order,
        description: category.description,
        featured: category.slug === FEATURED_CATEGORY_SLUG,
        seeded: true,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      { merge: true }
    );
  });

  await batch.commit();

  return [
    ...categories,
    ...missing.map((category) => ({
      id: category.slug,
      name: category.name,
      slug: category.slug,
      order: category.order,
      featured: category.slug === FEATURED_CATEGORY_SLUG,
      description: category.description
    }))
  ];
}

async function ensureStarterCatalogSeeded() {
  if (starterCatalogSeedPromise) {
    await starterCatalogSeedPromise;
    return;
  }

  starterCatalogSeedPromise = (async () => {
    const existingProducts = await adminDb.collection("products").limit(1).get();
    if (!existingProducts.empty) {
      return;
    }

    const seed = buildCatalogSeed();
    const batch = adminDb.batch();

    seed.categories.forEach((category) => {
      batch.set(adminDb.collection("categories").doc(category.id), category, { merge: true });
    });

    seed.products.forEach((product) => {
      batch.set(adminDb.collection("products").doc(product.slug), product, { merge: true });
    });

    await batch.commit();
  })();

  try {
    await starterCatalogSeedPromise;
  } finally {
    starterCatalogSeedPromise = null;
  }
}

export async function expireOverdueSubscriptions() {
  try {
    const snapshot = await adminDb
      .collection("subscriptions")
      .where("status", "==", "active")
      .where("expiresAt", "<=", new Date().toISOString())
      .get();

    if (snapshot.empty) {
      return;
    }

    const batch = adminDb.batch();
    const affectedAccountIds = new Set<string>();
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      batch.update(doc.ref, { status: "expired" });

      if (data.ottAccountId) {
        affectedAccountIds.add(String(data.ottAccountId));
        batch.update(adminDb.collection("ottAccounts").doc(String(data.ottAccountId)), {
          activeUsers: FieldValue.increment(-1)
        });
      }
    });

    await batch.commit();

    await Promise.all(
      Array.from(affectedAccountIds).map(async (accountId) => {
        const accountRef = adminDb.collection("ottAccounts").doc(accountId);
        const accountDoc = await accountRef.get();
        if (!accountDoc.exists) {
          return;
        }
        const account = accountDoc.data()!;
        const activeUsers = Math.max(Number(account.activeUsers || 0), 0);
        const maxUsers = Math.max(Number(account.maxUsers || 1), 1);
        const status = account.status === "disabled" ? "disabled" : activeUsers >= maxUsers ? "full" : "available";
        await accountRef.update({ activeUsers, status, updatedAt: new Date().toISOString() });
      })
    );
  } catch (error) {
    console.error("Subscription expiry task failed (likely missing index):", error);
  }
}

export async function getFeaturedProducts() {
  await ensureStarterCatalogSeeded();
  const [snapshot, seatMap] = await Promise.all([
    adminDb
      .collection("products")
      .where("featured", "==", true)
      .where("stockStatus", "==", "active")
      .limit(6)
      .get(),
    getDirectStockSeatMap()
  ]);

  return dedupeProducts(snapshot.docs.map((doc) => withDeliveryAndStock(withId<Product>(doc.id, doc.data()), seatMap)));
}

export async function getProducts() {
  await ensureStarterCatalogSeeded();
  const [snapshot, seatMap] = await Promise.all([
    adminDb.collection("products").where("stockStatus", "==", "active").get(),
    getDirectStockSeatMap()
  ]);
  return dedupeProducts(snapshot.docs.map((doc) => withDeliveryAndStock(withId<Product>(doc.id, doc.data()), seatMap)));
}

export async function getAdminProducts() {
  await ensureStarterCatalogSeeded();
  const [snapshot, seatMap] = await Promise.all([adminDb.collection("products").get(), getDirectStockSeatMap()]);
  return dedupeProducts(snapshot.docs.map((doc) => withDeliveryAndStock(withId<Product>(doc.id, doc.data()), seatMap)));
}

export async function getProductBySlug(slug: string) {
  await ensureStarterCatalogSeeded();
  const [snapshot, seatMap] = await Promise.all([
    adminDb
      .collection("products")
      .where("slug", "==", slug)
      .where("stockStatus", "==", "active")
      .limit(1)
      .get(),
    getDirectStockSeatMap()
  ]);

  return snapshot.empty ? null : withDeliveryAndStock(withId<Product>(snapshot.docs[0].id, snapshot.docs[0].data()), seatMap);
}

export async function getCategories() {
  await ensureStarterCatalogSeeded();
  const snapshot = await adminDb.collection("categories").get();
  const categories = snapshot.docs.map((doc) => withId<Category>(doc.id, doc.data()));
  const completeList = await ensureStarterCategories(categories);
  return sortCategories(completeList);
}

export async function getOffers() {
  const snapshot = await adminDb.collection("offers").where("active", "==", true).get();
  return snapshot.docs
    .map((doc) => withId<Offer>(doc.id, doc.data()))
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
}

export async function getSubscriptionsForUser(userId: string) {
  await expireOverdueSubscriptions();
  const snapshot = await adminDb.collection("subscriptions").where("userId", "==", userId).get();
  return snapshot.docs.map((doc) => withId<Subscription>(doc.id, doc.data()));
}

export async function getOrdersForUser(userId: string) {
  const snapshot = await adminDb
    .collection("orders")
    .where("userId", "==", userId)
    .get();
    
  return snapshot.docs
    .map((doc) => withId<Order>(doc.id, doc.data()))
    .sort((a: any, b: any) => (String(b.createdAt || "") > String(a.createdAt || "") ? 1 : -1));
}

export async function getAdminAnalytics(): Promise<AnalyticsSummary> {
  await expireOverdueSubscriptions();
  const [ordersSnapshot, usersSnapshot, subscriptionsSnapshot] = await Promise.all([
    adminDb.collection("orders").where("status", "==", "paid").get(),
    adminDb.collection("users").get(),
    adminDb.collection("subscriptions").where("status", "==", "active").get()
  ]);

  const revenue = ordersSnapshot.docs.reduce((sum, doc) => sum + Number(doc.data().amount || 0), 0);
  const monthlyMap = new Map<string, number>();

  ordersSnapshot.docs.forEach((doc) => {
    const date = new Date(doc.data().createdAt || Date.now());
    const label = date.toLocaleString("en-IN", { month: "short" });
    monthlyMap.set(label, (monthlyMap.get(label) || 0) + Number(doc.data().amount || 0));
  });

  return {
    revenue,
    orders: ordersSnapshot.size,
    activeUsers: usersSnapshot.size,
    activeSubscriptions: subscriptionsSnapshot.size,
    monthlyRevenue: Array.from(monthlyMap.entries()).map(([label, value]) => ({ label, value }))
  };
}

export async function getAllOrders() {
  const snapshot = await adminDb.collection("orders").orderBy("createdAt", "desc").limit(100).get();
  return snapshot.docs.map((doc) => withId<Order>(doc.id, doc.data()));
}

export async function getCoupons() {
  const snapshot = await adminDb.collection("coupons").orderBy("expiresAt", "asc").get();
  return snapshot.docs.map((doc) => withId<Coupon>(doc.id, doc.data()));
}

export async function getAdminOffers() {
  const snapshot = await adminDb.collection("offers").get();
  return snapshot.docs
    .map((doc) => withId<Offer>(doc.id, doc.data()))
    .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));
}

export async function getOttAccounts() {
  const snapshot = await adminDb.collection("ottAccounts").orderBy("provider", "asc").get();
  return snapshot.docs.map((doc) => withId<OttAccount>(doc.id, doc.data()));
}

export async function getRelatedProducts(categoryId: string, excludeProductId: string, limit = 4) {
  const [snapshot, seatMap] = await Promise.all([
    adminDb
      .collection("products")
      .where("stockStatus", "==", "active")
      .where("categoryId", "==", categoryId)
      .limit(12)
      .get(),
    getDirectStockSeatMap()
  ]);

  return snapshot.docs
    .map((doc) => withDeliveryAndStock(withId<Product>(doc.id, doc.data()), seatMap))
    .filter((item) => item.id !== excludeProductId)
    .slice(0, limit);
}

export async function getAllUsers() {
  const firestoreSnapshot = await adminDb.collection("users").limit(500).get();
  const firestoreMap = new Map<string, AppUser>();

  firestoreSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    firestoreMap.set(doc.id, {
      id: doc.id,
      email: String(data.email || ""),
      displayName: String(data.displayName || ""),
      role: (data.role || "user") as AppUser["role"],
      walletBalance: Number(data.walletBalance || 0),
      createdAt: String(data.createdAt || ""),
      suspended: data.suspended === true
    });
  });

  try {
    const authUsers = await adminAuth.listUsers(1000);

    authUsers.users.forEach((userRecord) => {
      const existing = firestoreMap.get(userRecord.uid);
      firestoreMap.set(userRecord.uid, {
        id: userRecord.uid,
        email: userRecord.email || existing?.email || "",
        displayName: userRecord.displayName || existing?.displayName || "",
        role: existing?.role || "user",
        walletBalance: Number(existing?.walletBalance || 0),
        createdAt: existing?.createdAt || userRecord.metadata.creationTime || "",
        suspended: userRecord.disabled || existing?.suspended || false
      });
    });
  } catch {
    // Fallback to Firestore-only user list if Auth listing is unavailable.
  }

  return Array.from(firestoreMap.values()).sort((a, b) => (String(a.createdAt || "") > String(b.createdAt || "") ? -1 : 1));
}

export async function getProductReviews(productId: string) {
  const snapshot = await adminDb
    .collection("reviews")
    .where("productId", "==", productId)
    .where("active", "==", true)
    .limit(20)
    .get();

  return snapshot.docs
    .map((doc) => withId<Review>(doc.id, doc.data()))
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
}

export async function getAdminReviews() {
  const snapshot = await adminDb.collection("reviews").orderBy("createdAt", "desc").limit(100).get();
  return snapshot.docs.map((doc) => withId<Review>(doc.id, doc.data()));
}

export async function getSupportTickets() {
  const snapshot = await adminDb.collection("supportTickets").orderBy("createdAt", "desc").limit(200).get();
  return snapshot.docs.map((doc) => withId<SupportTicket>(doc.id, doc.data()));
}

export async function getSupportTicketsForUser(userId: string) {
  const snapshot = await adminDb
    .collection("supportTickets")
    .where("userId", "==", userId)
    .limit(50)
    .get();
  return snapshot.docs
    .map((doc) => withId<SupportTicket>(doc.id, doc.data()))
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
}

export async function assignOttAccount(productId: string) {
  const snapshot = await adminDb
    .collection("ottAccounts")
    .where("productId", "==", productId)
    .where("status", "==", "available")
    .get();

  const accountDoc = snapshot.docs.find((doc) => {
    const data = doc.data();
    return Number(data.activeUsers || 0) < Number(data.maxUsers || 1);
  });

  if (!accountDoc) {
    return null;
  }

  await accountDoc.ref.update({
    activeUsers: FieldValue.increment(1)
  });

  return withId<OttAccount>(accountDoc.id, accountDoc.data());
}
