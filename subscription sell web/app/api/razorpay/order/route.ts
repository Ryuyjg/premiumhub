import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { getRazorpayClient } from "@/lib/razorpay";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const { productId, couponCode } = await request.json();

  if (!productId) {
    return NextResponse.json({ error: "Product is required." }, { status: 400 });
  }

  const productDoc = await adminDb.collection("products").doc(productId).get();
  if (!productDoc.exists) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const product = productDoc.data()!;
  let finalAmount = Number(product.salePrice || product.price);
  let discountAmount = 0;

  if (couponCode) {
    const couponSnapshot = await adminDb
      .collection("coupons")
      .where("code", "==", String(couponCode).toUpperCase())
      .where("active", "==", true)
      .limit(1)
      .get();

    if (!couponSnapshot.empty) {
      const coupon = couponSnapshot.docs[0].data();
      if (new Date(coupon.expiresAt) > new Date() && Number(coupon.usedCount || 0) < Number(coupon.usageLimit || 0)) {
        discountAmount =
          coupon.type === "percent"
            ? Math.round((finalAmount * Number(coupon.value || 0)) / 100)
            : Number(coupon.value || 0);
        finalAmount = Math.max(finalAmount - discountAmount, 1);
      }
    }
  }

  const razorpay = getRazorpayClient();
  const razorpayOrder = await razorpay.orders.create({
    amount: finalAmount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`
  });

  const orderRef = await adminDb.collection("orders").add({
    userId: user.id,
    productId,
    productName: product.name,
    productSlug: product.slug,
    amount: finalAmount,
    status: "created",
    razorpayOrderId: razorpayOrder.id,
    couponCode: couponCode || null,
    discountAmount,
    createdAt: new Date().toISOString()
  });

  return NextResponse.json({
    id: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    internalOrderId: orderRef.id
  });
}
