import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { createMaxelPaySession } from "@/lib/maxelpay";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { productId, couponCode, customerDeliveryEmail } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: "Product is required." }, { status: 400 });
    }

    const productDoc = await adminDb.collection("products").doc(productId).get();
    if (!productDoc.exists) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const product = productDoc.data()!;
    const deliveryMode = String(product.deliveryMode || "direct_credentials");

    if (deliveryMode === "direct_credentials") {
      const accountSnapshot = await adminDb
        .collection("ottAccounts")
        .where("productId", "==", productId)
        .where("status", "==", "available")
        .limit(20)
        .get();

      const hasSeat = accountSnapshot.docs.some((doc) => {
        const data = doc.data();
        return Number(data.activeUsers || 0) < Number(data.maxUsers || 0);
      });

      if (!hasSeat) {
        return NextResponse.json({ error: "No stock available for this item." }, { status: 400 });
      }
    }

    if (deliveryMode === "email_invite" && !String(customerDeliveryEmail || "").trim()) {
      return NextResponse.json({ error: "Please enter your email for invitation delivery." }, { status: 400 });
    }

    let finalAmount = Number(product.salePrice || product.price);
    let discountAmount = 0;

    if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
      return NextResponse.json({ error: "Invalid product price." }, { status: 400 });
    }

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

    const appOrigin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const orderToken = `order_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const session = await createMaxelPaySession({
      orderId: orderToken,
      amount: Number(finalAmount.toFixed(2)),
      currency: "USDT",
      description: `${product.name} purchase`,
      successUrl: `${appOrigin}/checkout/success`,
      cancelUrl: `${appOrigin}/checkout/cancel`,
      callbackUrl: `${appOrigin}/api/maxelpay/webhook`
    });

    if (!session.sessionId || !session.checkoutUrl) {
      return NextResponse.json({ error: "MaxelPay session created but response was incomplete." }, { status: 502 });
    }

    const orderRef = await adminDb.collection("orders").add({
      userId: user.id,
      productId,
      productName: product.name,
      productSlug: product.slug,
      deliveryMode,
      customerDeliveryEmail: String(customerDeliveryEmail || "").trim() || null,
      amount: finalAmount,
      status: "created",
      razorpayOrderId: session.sessionId,
      maxelpaySessionId: session.sessionId,
      paymentMethod: "maxelpay",
      couponCode: couponCode || null,
      discountAmount,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      id: session.sessionId,
      amount: finalAmount,
      currency: "USDT",
      checkoutUrl: session.checkoutUrl,
      internalOrderId: orderRef.id
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create MaxelPay checkout session.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
