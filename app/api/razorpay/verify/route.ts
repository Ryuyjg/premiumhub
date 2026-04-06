import crypto from "crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { fulfillPaidOrder } from "@/lib/order-fulfillment";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json();
  const {
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
    orderId,
    productId
  } = body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !orderId || !productId) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    await adminDb.collection("orders").doc(orderId).set(
      {
        status: "failed",
        razorpayPaymentId,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const orderDoc = await adminDb.collection("orders").doc(orderId).get();
  if (!orderDoc.exists) {
    return NextResponse.json({ error: "Order missing." }, { status: 404 });
  }
  const order = orderDoc.data()!;

  if (order.userId !== user.id || order.razorpayOrderId !== razorpayOrderId || order.productId !== productId) {
    return NextResponse.json({ error: "Order mismatch." }, { status: 400 });
  }

  const fulfillment = await fulfillPaidOrder({
    orderId,
    productId,
    userId: user.id,
    razorpayPaymentId,
    paymentMethod: "razorpay",
    metadata: {
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      device: request.headers.get("sec-ch-ua-platform") || "unknown"
    }
  });

  return NextResponse.json(fulfillment);
}
