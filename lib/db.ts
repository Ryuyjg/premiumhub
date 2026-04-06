import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";
import type {
  AppUser,
  AnalyticsSummary,
  Category,
  Coupon,
  Order,
  OttAccount,
  Product,
  Subscription
} from "@/types";

function withId<T>(id: string, data: FirebaseFirestore.DocumentData) {
  return { id, ...data } as T;
}

export async function expireOverdueSubscriptions() {
  const snapshot = await adminDb
    .collection("subscriptions")
    .where("status", "==", "active")
    .where("expiresAt", "<=", new Date().toISOString())
    .get();

  if (snapshot.empty) {
    return;
  }

  const batch = adminDb.batch();
  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    batch.update(doc.ref, { status: "expired" });

    if (data.ottAccountId) {
      batch.update(adminDb.collection("ottAccounts").doc(String(data.ottAccountId)), {
        activeUsers: FieldValue.increment(-1)
      });
    }
  });

  await batch.commit();
}

export async function getFeaturedProducts() {
  const snapshot = await adminDb
    .collection("products")
    .where("featured", "==", true)
    .where("stockStatus", "==", "active")
    .limit(6)
    .get();

  return snapshot.docs.map((doc) => withId<Product>(doc.id, doc.data()));
}

export async function getProducts() {
  const snapshot = await adminDb.collection("products").where("stockStatus", "==", "active").get();
  return snapshot.docs.map((doc) => withId<Product>(doc.id, doc.data()));
}

export async function getAdminProducts() {
  const snapshot = await adminDb.collection("products").get();
  return snapshot.docs.map((doc) => withId<Product>(doc.id, doc.data()));
}

export async function getProductBySlug(slug: string) {
  const snapshot = await adminDb
    .collection("products")
    .where("slug", "==", slug)
    .where("stockStatus", "==", "active")
    .limit(1)
    .get();

  return snapshot.empty ? null : withId<Product>(snapshot.docs[0].id, snapshot.docs[0].data());
}

export async function getCategories() {
  const snapshot = await adminDb.collection("categories").get();
  return snapshot.docs.map((doc) => withId<Category>(doc.id, doc.data()));
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
    .orderBy("createdAt", "desc")
    .get();
  return snapshot.docs.map((doc) => withId<Order>(doc.id, doc.data()));
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

export async function getOttAccounts() {
  const snapshot = await adminDb.collection("ottAccounts").orderBy("provider", "asc").get();
  return snapshot.docs.map((doc) => withId<OttAccount>(doc.id, doc.data()));
}

export async function getAllUsers() {
  const snapshot = await adminDb.collection("users").orderBy("createdAt", "desc").limit(200).get();
  return snapshot.docs.map((doc) => withId<AppUser>(doc.id, doc.data()));
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
