import { NextResponse } from "next/server";

export const dynamic = "force-static";
import { isAdminAuthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const allowed = await isAdminAuthorized();
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const ordersSnapshot = await adminDb
      .collection("orders")
      .orderBy("createdAt", "desc")
      .limit(10)
      .get();

    const results = await Promise.all(
      ordersSnapshot.docs.map(async (doc) => {
        const order = doc.data();
        const subSnapshot = await adminDb
          .collection("subscriptions")
          .where("orderId", "==", doc.id)
          .limit(1)
          .get();

        const productDoc = await adminDb.collection("products").doc(order.productId).get();
        const accountSnapshot = await adminDb
          .collection("ottAccounts")
          .where("productId", "==", order.productId)
          .get();

        return {
          id: doc.id,
          userId: order.userId,
          productId: order.productId,
          productName: order.productName,
          productExists: productDoc.exists,
          status: order.status,
          paymentMethod: order.paymentMethod,
          createdAt: order.createdAt,
          hasSubscription: !subSnapshot.empty,
          subscriptionStatus: subSnapshot.empty ? null : subSnapshot.docs[0].data().status,
          availableAccounts: accountSnapshot.docs.filter((a) => a.data().status === "available").length,
          allAccountsLinked: accountSnapshot.size
        };
      })
    );

    return NextResponse.json({
        totalOrdersCheck: results.length,
        recentOrders: results
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
