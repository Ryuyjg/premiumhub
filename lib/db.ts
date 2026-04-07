import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { STARTER_CATEGORIES, STARTER_PRODUCTS } from "@/lib/starter-catalog";
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

let starterCatalogSeedPromise: Promise<void> | null = null;
let starterCatalogSeeded = false;

function withId<T>(id: string, data: any) {
  return { id, ...data } as T;
}

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

  return {
    ...product,
    deliveryMode,
    otpSupportNumber: product.otpSupportNumber || "",
    deliveryNotes: product.deliveryNotes || "",
    isOutOfStock
  };
}

async function ensureStarterCatalogSeeded() {
  if (starterCatalogSeeded) {
    return;
  }

  if (starterCatalogSeedPromise) {
    await starterCatalogSeedPromise;
    return;
  }

  starterCatalogSeedPromise = (async () => {
    const categoryIdBySlug = new Map<string, string>();
    const categoryNameBySlug = new Map<string, string>();

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
      categoryIdBySlug.set(slug, ref.id);
      categoryNameBySlug.set(slug, category.name);
    }

    const now = new Date().toISOString();

    for (const product of STARTER_PRODUCTS) {
      const categorySlug = slugify(product.categoryName);
      const categoryId = categoryIdBySlug.get(categorySlug);
      const categoryName = categoryNameBySlug.get(categorySlug) || product.categoryName;
      if (!categoryId) continue;

      const slug = slugify(product.name);
      const existing = await adminDb.collection("products").where("slug", "==", slug).limit(1).get();
      if (!existing.empty) continue;

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
    }

    starterCatalogSeeded = true;
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

  return snapshot.docs.map((doc) => withDeliveryAndStock(withId<Product>(doc.id, doc.data()), seatMap));
}

export async function getProducts() {
  await ensureStarterCatalogSeeded();
  const [snapshot, seatMap] = await Promise.all([
    adminDb.collection("products").where("stockStatus", "==", "active").get(),
    getDirectStockSeatMap()
  ]);
  return snapshot.docs.map((doc) => withDeliveryAndStock(withId<Product>(doc.id, doc.data()), seatMap));
}

export async function getAdminProducts() {
  await ensureStarterCatalogSeeded();
  const [snapshot, seatMap] = await Promise.all([adminDb.collection("products").get(), getDirectStockSeatMap()]);
  return snapshot.docs.map((doc) => withDeliveryAndStock(withId<Product>(doc.id, doc.data()), seatMap));
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
  return snapshot.docs.map((doc) => withId<Category>(doc.id, doc.data()));
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
