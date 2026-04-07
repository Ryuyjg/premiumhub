import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { fulfillUroPayOrders, markUroPayOrdersFailed } from "@/lib/uropay-order-sync";
import { getUroPayOrderStatus, isUroPayCompleted, isUroPayFailed } from "@/lib/uropay";

export async function GET(request: Request, context: { params: Promise<{ gatewayOrderId: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const params = await context.params;
    const gatewayOrderId = String(params.gatewayOrderId || "").trim();
    if (!gatewayOrderId) {
      return NextResponse.json({ error: "gatewayOrderId is required." }, { status: 400 });
    }

    const orderSnapshot = await adminDb.collection("orders").where("userId", "==", user.id).get();
    const matchingOrders = orderSnapshot.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() || {}) }))
      .filter((order: any) => order.paymentMethod === "uropay" && String(order.gatewayOrderId || "") === gatewayOrderId);

    if (matchingOrders.length === 0) {
      return NextResponse.json({ error: "No UroPay orders found." }, { status: 404 });
    }

    const statusResponse = await getUroPayOrderStatus(gatewayOrderId);

    if (isUroPayCompleted(statusResponse.orderStatus)) {
      const result = await fulfillUroPayOrders(matchingOrders, {
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
      await markUroPayOrdersFailed(matchingOrders);
    }

    return NextResponse.json({
      success: true,
      gatewayOrderId,
      gatewayStatus: statusResponse.orderStatus
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch UroPay order status.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
