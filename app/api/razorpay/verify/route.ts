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
    orderId: singleOrderId, // Optional for carts
    productId: singleProductId, // Optional for carts
    isCart: isCartFlag
  } = body;

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  // 1. Verify Signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    if (singleOrderId) {
        await adminDb.collection("orders").doc(singleOrderId).set({
            status: "failed",
            razorpayPaymentId,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    }
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  // 2. Resolve Orders to Fulfill
  let ordersToFulfill: { id: string, productId: string }[] = [];

  if (isCartFlag) {
    const cartSnapshot = await adminDb
        .collection("orders")
        .where("razorpayOrderId", "==", razorpayOrderId)
        .where("userId", "==", user.id)
        .get();
        
    ordersToFulfill = cartSnapshot.docs.map((doc: any) => ({
        id: doc.id,
        productId: doc.data().productId
    }));
  } else if (singleOrderId && singleProductId) {
    ordersToFulfill = [{ id: singleOrderId, productId: singleProductId }];
  }

  if (ordersToFulfill.length === 0) {
    return NextResponse.json({ error: "No orders found to fulfill." }, { status: 404 });
  }

  // 3. Batch Fulfill
  const results = await Promise.all(
    ordersToFulfill.map(o => fulfillPaidOrder({
        orderId: o.id,
        productId: o.productId,
        userId: user.id,
        razorpayPaymentId,
        paymentMethod: "razorpay",
        metadata: {
          ip: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
          device: request.headers.get("sec-ch-ua-platform") || "unknown"
        }
    }))
  );

  return NextResponse.json({ 
      success: true, 
      count: results.length,
      orders: ordersToFulfill.map(o => o.id)
  });
}
