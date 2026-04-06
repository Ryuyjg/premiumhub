import crypto from "crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { assignOttAccount } from "@/lib/db";
import { decryptSensitiveValue } from "@/lib/crypto";
import { adminDb } from "@/lib/firebase/admin";

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
    await adminDb.collection("orders").doc(orderId).update({
      status: "failed",
      razorpayPaymentId
    });
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const [productDoc, orderDoc] = await Promise.all([
    adminDb.collection("products").doc(productId).get(),
    adminDb.collection("orders").doc(orderId).get()
  ]);

  if (!productDoc.exists || !orderDoc.exists) {
    return NextResponse.json({ error: "Order or product missing." }, { status: 404 });
  }

  const product = productDoc.data()!;
  const order = orderDoc.data()!;

  if (order.userId !== user.id || order.razorpayOrderId !== razorpayOrderId || order.productId !== productId) {
    return NextResponse.json({ error: "Order mismatch." }, { status: 400 });
  }

  if (order.status === "paid") {
    return NextResponse.json({ success: true, idempotent: true });
  }

  const ottAccount = await assignOttAccount(productId);
  const startsAt = new Date();
  const expiresAt = new Date(Date.now() + Number(product.durationInDays || 30) * 24 * 60 * 60 * 1000);

  await adminDb.collection("orders").doc(orderId).update({
    status: "paid",
    razorpayPaymentId,
    metadata: {
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
      device: request.headers.get("sec-ch-ua-platform") || "unknown"
    }
  });

  await adminDb.collection("subscriptions").add({
    userId: user.id,
    productId,
    orderId,
    productName: product.name,
    status: "active",
    startsAt: startsAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    ottAccountId: ottAccount?.id || null,
    assignedCredentialLabel: ottAccount
      ? `${ottAccount.label} • ${decryptSensitiveValue(ottAccount.emailCiphertext)}`
      : "Pending manual assignment"
  });

  if (ottAccount) {
    await adminDb.collection("orderFulfillments").add({
      userId: user.id,
      orderId,
      ottAccountId: ottAccount.id,
      deliveredAt: new Date().toISOString()
    });
  }

  if (order.couponCode) {
    const couponSnapshot = await adminDb
      .collection("coupons")
      .where("code", "==", order.couponCode)
      .limit(1)
      .get();

    if (!couponSnapshot.empty) {
      await couponSnapshot.docs[0].ref.update({
        usedCount: (couponSnapshot.docs[0].data().usedCount || 0) + 1
      });
    }
  }

  return NextResponse.json({ success: true });
}
