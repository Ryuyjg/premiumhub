import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { createUroPayOrder } from "@/lib/uropay";
import type { Product } from "@/types";

type CouponCandidate = {
  type?: "flat" | "percent" | string;
  value?: number;
};

function computeFinalAmount(baseAmount: number, coupon: CouponCandidate | null) {
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

async function ensureProductStock(productId: string, product: Product) {
  if (product.deliveryMode !== "direct_credentials") {
    return;
  }

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
    throw new Error(`${product.name} is out of stock.`);
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const productId = String(body?.productId || "").trim();
    const productIds = Array.isArray(body?.productIds) ? body.productIds.map((id: unknown) => String(id || "").trim()).filter(Boolean) : [];
    const couponCode = String(body?.couponCode || "").trim().toUpperCase();
    const customerDeliveryEmail = String(body?.customerDeliveryEmail || "").trim();

    const isCart = productIds.length > 0;
    const requestedIds = isCart ? productIds : productId ? [productId] : [];

    if (requestedIds.length === 0) {
      return NextResponse.json({ error: "No products selected." }, { status: 400 });
    }

    const productDocs = await Promise.all(requestedIds.map((id) => adminDb.collection("products").doc(id).get()));

    const products: Array<Product & { id: string }> = [];
    for (const doc of productDocs) {
      if (!doc.exists) {
        return NextResponse.json({ error: "One or more products were not found." }, { status: 404 });
      }

      const data = doc.data() as Product;
      const product = { id: doc.id, ...data };
      await ensureProductStock(doc.id, product);

      if (product.deliveryMode === "email_invite" && !customerDeliveryEmail) {
        return NextResponse.json({ error: "Please enter your email for invitation delivery." }, { status: 400 });
      }

      products.push(product);
    }

    let couponData: CouponCandidate | null = null;
    if (!isCart && couponCode) {
      const couponSnapshot = await adminDb
        .collection("coupons")
        .where("code", "==", couponCode)
        .where("active", "==", true)
        .limit(1)
        .get();

      if (!couponSnapshot.empty) {
        const coupon = couponSnapshot.docs[0].data();
        if (new Date(coupon.expiresAt) > new Date() && Number(coupon.usedCount || 0) < Number(coupon.usageLimit || 0)) {
          couponData = {
            type: coupon.type,
            value: Number(coupon.value || 0)
          };
        }
      }
    }

    const pricedProducts = products.map((product, index) => {
      const baseAmount = Number(product.salePrice || product.price);
      if (!Number.isFinite(baseAmount) || baseAmount <= 0) {
        throw new Error(`Invalid price for ${product.name}.`);
      }

      const pricing = !isCart && index === 0 ? computeFinalAmount(baseAmount, couponData) : { finalAmount: baseAmount, discountAmount: 0 };
      return { product, ...pricing };
    });

    const totalAmount = pricedProducts.reduce((sum, item) => sum + item.finalAmount, 0);
    const merchantOrderId = `${isCart ? "cart" : "product"}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const session = await createUroPayOrder({
      amountInPaise: Math.round(totalAmount * 100),
      merchantOrderId,
      customerName: user.displayName || user.email.split("@")[0] || "Customer",
      customerEmail: customerDeliveryEmail || user.email,
      transactionNote: isCart ? `Cart ${merchantOrderId}` : `${products[0].name} ${merchantOrderId}`,
      notes: {
        userId: user.id,
        mode: isCart ? "cart" : "product",
        productIds: requestedIds.join(",")
      }
    });

    if (!session.uroPayOrderId || !session.qrCode) {
      return NextResponse.json({ error: "UroPay order was created but response was incomplete." }, { status: 502 });
    }

    const batch = adminDb.batch();
    const localOrderIds: string[] = [];
    const createdAt = new Date().toISOString();

    for (const priced of pricedProducts) {
      const orderRef = adminDb.collection("orders").doc();
      batch.set(orderRef, {
        userId: user.id,
        productId: priced.product.id,
        productName: priced.product.name,
        productSlug: priced.product.slug,
        deliveryMode: priced.product.deliveryMode || "direct_credentials",
        customerDeliveryEmail: customerDeliveryEmail || null,
        amount: priced.finalAmount,
        status: "created",
        paymentMethod: "uropay",
        gatewayOrderId: session.uroPayOrderId,
        couponCode: !isCart ? couponCode || null : null,
        discountAmount: priced.discountAmount,
        createdAt,
        updatedAt: createdAt
      });
      localOrderIds.push(orderRef.id);
    }

    await batch.commit();

    return NextResponse.json({
      gatewayOrderId: session.uroPayOrderId,
      gatewayStatus: session.orderStatus || "CREATED",
      qrCode: session.qrCode,
      upiString: session.upiString,
      amount: totalAmount,
      amountInRupees: session.amountInRupees || totalAmount.toFixed(2),
      localOrderIds
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create UroPay order.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
