import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { fulfillUroPayOrders, markUroPayOrdersFailed } from "@/lib/uropay-order-sync";
import { getUroPayWebhookTransaction, markUroPayWebhookTransactionProcessed } from "@/lib/uropay-transaction-store";
import { getUroPayOrderStatus, isUroPayCompleted, isUroPayFailed, updateUroPayOrder } from "@/lib/uropay";

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const gatewayOrderId = String(body?.gatewayOrderId || "").trim();
    const referenceNumber = String(body?.referenceNumber || "").trim();

    if (!gatewayOrderId || !referenceNumber) {
      return NextResponse.json({ error: "gatewayOrderId and referenceNumber are required." }, { status: 400 });
    }

    const orderSnapshot = await adminDb.collection("orders").where("userId", "==", user.id).get();
    const matchingOrders = orderSnapshot.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() || {}) }))
      .filter((order: any) => order.paymentMethod === "uropay" && String(order.gatewayOrderId || "") === gatewayOrderId);

    if (matchingOrders.length === 0) {
      return NextResponse.json({ error: "No pending UroPay orders found." }, { status: 404 });
    }

    const updateResponse = await updateUroPayOrder({
      uroPayOrderId: gatewayOrderId,
      referenceNumber
    });

    await Promise.all(
      matchingOrders.map((order: any) =>
        adminDb.collection("orders").doc(order.id).set(
          {
            gatewayPaymentId: referenceNumber,
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        )
      )
    );

    const statusResponse = await getUroPayOrderStatus(gatewayOrderId);
    const syncedOrders = matchingOrders.map((order: any) => ({ ...order, gatewayPaymentId: referenceNumber }));
    const webhookTransaction = await getUroPayWebhookTransaction(referenceNumber);

    if (webhookTransaction && webhookTransaction.amount > 0) {
      const result = await fulfillUroPayOrders(syncedOrders, {
        ip: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: "uropay-reference-webhook-match",
        device: webhookTransaction.environment || "unknown"
      });
      await markUroPayWebhookTransactionProcessed(referenceNumber);

      return NextResponse.json({
        success: true,
        gatewayOrderId,
        gatewayStatus: "COMPLETED",
        fulfilled: result.fulfilled
      });
    }

    if (isUroPayCompleted(statusResponse.orderStatus)) {
      const result = await fulfillUroPayOrders(syncedOrders, {
        ip: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
        device: request.headers.get("sec-ch-ua-platform") || "unknown"
      });

      return NextResponse.json({
        success: true,
        gatewayOrderId,
        gatewayStatus: statusResponse.orderStatus,
        fulfilled: result.fulfilled
      });
    }

    if (isUroPayFailed(statusResponse.orderStatus)) {
      await markUroPayOrdersFailed(syncedOrders);
    }

    return NextResponse.json({
      success: true,
      gatewayOrderId,
      gatewayStatus: statusResponse.orderStatus || updateResponse.orderStatus || "UPDATED"
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to submit UPI reference number.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
