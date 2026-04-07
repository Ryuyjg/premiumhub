import { adminDb } from "@/lib/firebase/admin";
import { fulfillPaidOrder } from "@/lib/order-fulfillment";

type LocalOrder = {
  id: string;
  productId: string;
  userId: string;
  status?: string;
  gatewayPaymentId?: string | null;
};

export async function fulfillUroPayOrders(orders: LocalOrder[], metadata?: { ip?: string; userAgent?: string; device?: string }) {
  const pendingOrders = orders.filter((order) => order.status === "created");

  if (pendingOrders.length === 0) {
    return { fulfilled: 0, idempotent: true };
  }

  await Promise.all(
    pendingOrders.map((order) =>
      fulfillPaidOrder({
        orderId: order.id,
        productId: order.productId,
        userId: order.userId,
        gatewayPaymentId: order.gatewayPaymentId || undefined,
        paymentMethod: "uropay",
        metadata
      })
    )
  );

  return { fulfilled: pendingOrders.length, idempotent: false };
}

export async function markUroPayOrdersFailed(orders: LocalOrder[]) {
  const pendingOrders = orders.filter((order) => order.status === "created");

  await Promise.all(
    pendingOrders.map((order) =>
      adminDb.collection("orders").doc(order.id).set(
        {
          status: "failed",
          updatedAt: new Date().toISOString()
        },
        { merge: true }
      )
    )
  );

  return pendingOrders.length;
}
