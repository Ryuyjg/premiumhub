import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { fulfillPaidOrder } from "@/lib/order-fulfillment";

function computeFinalAmount(baseAmount: number, coupon: Record<string, unknown> | null) {
  let finalAmount = baseAmount;
  let discountAmount = 0;

  if (coupon) {
    discountAmount =
      coupon.type === "percent"
        ? Math.round((finalAmount * Number(coupon.value || 0)) / 100)
        : Number(coupon.value || 0);
    finalAmount = Math.max(finalAmount - discountAmount, 1);
  }

  return { finalAmount, discountAmount };
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { productId, couponCode } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: "Product is required." }, { status: 400 });
    }

    const productDoc = await adminDb.collection("products").doc(productId).get();
    if (!productDoc.exists) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const product = productDoc.data()!;
    const baseAmount = Number(product.salePrice || product.price);
    if (!Number.isFinite(baseAmount) || baseAmount <= 0) {
      return NextResponse.json({ error: "Invalid product price." }, { status: 400 });
    }

    let couponData: Record<string, unknown> | null = null;
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
          couponData = coupon;
        }
      }
    }

    const { finalAmount, discountAmount } = computeFinalAmount(baseAmount, couponData);

    const orderRef = adminDb.collection("orders").doc();
    await adminDb.runTransaction(async (transaction) => {
      const userRef = adminDb.collection("users").doc(user.id);
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error("User profile missing.");
      }

      const walletBalance = Number(userDoc.data()?.walletBalance || 0);
      if (walletBalance < finalAmount) {
        throw new Error("Insufficient wallet balance.");
      }

      transaction.update(userRef, {
        walletBalance: walletBalance - finalAmount,
        updatedAt: new Date().toISOString()
      });

      transaction.set(orderRef, {
        userId: user.id,
        productId,
        productName: product.name,
        productSlug: product.slug,
        amount: finalAmount,
        status: "paid",
        paymentMethod: "wallet",
        walletDeducted: finalAmount,
        razorpayOrderId: null,
        couponCode: couponCode || null,
        discountAmount,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });

    const fulfillment = await fulfillPaidOrder({
      orderId: orderRef.id,
      productId,
      userId: user.id,
      paymentMethod: "wallet",
      metadata: {
        ip: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
        device: request.headers.get("sec-ch-ua-platform") || "unknown"
      }
    });

    return NextResponse.json({
      internalOrderId: orderRef.id,
      ...fulfillment
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Wallet purchase failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
