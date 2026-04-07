import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { fulfillPaidOrder } from "@/lib/order-fulfillment";
import { getMaxelPaySessionStatus, isFailedStatus, isPaidStatus } from "@/lib/maxelpay";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const sessionId = String(body?.sessionId || "").trim();

    const orderSnapshot = await adminDb
      .collection("orders")
      .where("userId", "==", user.id)
      .where("paymentMethod", "==", "maxelpay")
      .limit(50)
      .get();

    const matchingOrders = orderSnapshot.docs
      .map((doc: any) => ({ id: doc.id, ...(doc.data() || {}) }))
      .filter((order: any) => order.status === "created")
      .filter((order: any) =>
        sessionId ? String(order.maxelpaySessionId || order.razorpayOrderId || "") === sessionId : true
      );

    if (matchingOrders.length === 0) {
      return NextResponse.json({ error: "No pending MaxelPay orders found." }, { status: 404 });
    }

    const targetSessionId = sessionId || String(matchingOrders[0].maxelpaySessionId || matchingOrders[0].razorpayOrderId || "");
    if (!targetSessionId) {
      return NextResponse.json({ error: "Session id missing for pending order." }, { status: 400 });
    }

    const statusResponse = await getMaxelPaySessionStatus(targetSessionId);
    const status = statusResponse.status;

    if (isPaidStatus(status)) {
      const sessionOrders = matchingOrders.filter(
        (order: any) => String(order.maxelpaySessionId || order.razorpayOrderId || "") === targetSessionId
      );

      const results = await Promise.all(
        sessionOrders.map((order: any) =>
          fulfillPaidOrder({
            orderId: String(order.id),
            productId: String(order.productId),
            userId: user.id,
            razorpayPaymentId: targetSessionId,
            paymentMethod: "maxelpay",
            metadata: {
              ip: request.headers.get("x-forwarded-for") || "unknown",
              userAgent: request.headers.get("user-agent") || "unknown",
              device: request.headers.get("sec-ch-ua-platform") || "unknown"
            }
          })
        )
      );

      return NextResponse.json({
        success: true,
        status,
        count: results.length
      });
    }

    if (isFailedStatus(status)) {
      await Promise.all(
        matchingOrders
          .filter((order: any) => String(order.maxelpaySessionId || order.razorpayOrderId || "") === targetSessionId)
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
      success: false,
      pending: !isFailedStatus(status),
      status: status || "unknown"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to confirm MaxelPay payment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

