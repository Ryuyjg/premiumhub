import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { createMaxelPaySession } from "@/lib/maxelpay";
import type { Product } from "@/types";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { productIds, customerDeliveryEmail } = await request.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: "No products in cart." }, { status: 400 });
    }

    // Fetch all products
    const productRefs = productIds.map(id => adminDb.collection("products").doc(id).get());
    const productDocs = await Promise.all(productRefs);
    
    const products: Product[] = [];
    let totalAmount = 0;

    for (const doc of productDocs) {
      if (!doc.exists) {
        return NextResponse.json({ error: "One or more products not found." }, { status: 404 });
      }
      const data = doc.data() as Product;
      products.push({ id: doc.id, ...data });
      totalAmount += (data.salePrice || data.price);

      // Stock check for direct credentials
      if (data.deliveryMode === "direct_credentials") {
        const accountSnapshot = await adminDb
          .collection("ottAccounts")
          .where("productId", "==", doc.id)
          .where("status", "==", "available")
          .limit(1)
          .get();
        
        if (accountSnapshot.empty) {
            return NextResponse.json({ error: `${data.name} is out of stock.` }, { status: 400 });
        }
      }
    }

    if (totalAmount <= 0) {
      return NextResponse.json({ error: "Invalid total amount." }, { status: 400 });
    }

    const appOrigin = new URL(request.url).origin;
    const orderToken = `cart_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const session = await createMaxelPaySession({
      orderId: orderToken,
      amount: Number(totalAmount.toFixed(2)),
      currency: "USD",
      description: `${products.length} plans in cart`,
      successUrl: `${appOrigin}/checkout/success`,
      cancelUrl: `${appOrigin}/checkout/cancel`,
      callbackUrl: `${appOrigin}/api/maxelpay/webhook`
    });

    if (!session.sessionId || !session.checkoutUrl) {
      return NextResponse.json({ error: "MaxelPay session created but response was incomplete." }, { status: 502 });
    }

    // Create individual orders in Firestore
    const batch = adminDb.batch();
    const orderIds: string[] = [];

    for (const p of products) {
        const orderRef = adminDb.collection("orders").doc();
        batch.set(orderRef, {
            userId: user.id,
            productId: p.id,
            productName: p.name,
            productSlug: p.slug,
            deliveryMode: p.deliveryMode || "direct_credentials",
            customerDeliveryEmail: String(customerDeliveryEmail || "").trim() || null,
            amount: p.salePrice || p.price,
            status: "created",
            razorpayOrderId: session.sessionId,
            maxelpaySessionId: session.sessionId,
            paymentMethod: "maxelpay",
            createdAt: new Date().toISOString()
        });
        orderIds.push(orderRef.id);
    }

    await batch.commit();

    return NextResponse.json({
      id: session.sessionId,
      amount: totalAmount,
      currency: "USDT",
      checkoutUrl: session.checkoutUrl,
      internalOrderIds: orderIds
    });
  } catch (error) {
    console.error("Cart checkout error:", error);
    return NextResponse.json({ error: "Checkout failed." }, { status: 500 });
  }
}
