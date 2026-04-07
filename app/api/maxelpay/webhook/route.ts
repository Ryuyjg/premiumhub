import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { fulfillPaidOrder } from "@/lib/order-fulfillment";
import {
  getMaxelPaySessionStatus,
  isFailedStatus,
  isPaidStatus,
  readPaymentStatus,
  readSessionId
} from "@/lib/maxelpay";

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));
    const sessionId = readSessionId(payload);
    const incomingStatus = readPaymentStatus(payload);

    if (!sessionId) {
      return NextResponse.json({ error: "Missing session id." }, { status: 400 });
    }

    const resolvedStatus = incomingStatus || (await getMaxelPaySessionStatus(sessionId)).status;

    const orderSnapshot = await adminDb
      .collection("orders")
      .where("maxelpaySessionId", "==", sessionId)
      .limit(100)
      .get();

    if (orderSnapshot.empty) {
      return NextResponse.json({ success: true, message: "No orders mapped to session." });
    }

    const orders = orderSnapshot.docs.map((doc: any) => ({ id: doc.id, ...(doc.data() || {}) }));

    if (isPaidStatus(resolvedStatus)) {
      const createdOrders = orders.filter((order: any) => order.status === "created");
      await Promise.all(
        createdOrders.map((order: any) =>
          fulfillPaidOrder({
            orderId: String(order.id),
            productId: String(order.productId),
            userId: String(order.userId),
            razorpayPaymentId: sessionId,
            paymentMethod: "maxelpay",
            metadata: {
              ip: request.headers.get("x-forwarded-for") || "unknown",
              userAgent: request.headers.get("user-agent") || "unknown",
              device: "webhook"
            }
          })
        )
      );

      return NextResponse.json({
        success: true,
        status: resolvedStatus,
        fulfilled: createdOrders.length
      });
    }

    if (isFailedStatus(resolvedStatus)) {
      await Promise.all(
        orders
          .filter((order: any) => order.status === "created")
          .map((order: any) =>
            adminDb.collection("orders").doc(order.id).set(
              {
                status: "failed",
                updatedAt: new Date().toISOString()
              },
              { merge: true }
            )
          )
      );
    }

    return NextResponse.json({
      success: true,
      status: resolvedStatus || "unknown"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "MaxelPay webhook handling failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

