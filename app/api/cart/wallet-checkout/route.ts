import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { fulfillPaidOrder } from "@/lib/order-fulfillment";
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

    // Fetch products to verify existence and calculate total
    const productDocs = await Promise.all(productIds.map(id => adminDb.collection("products").doc(id).get()));
    
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

    const orderIds: string[] = [];

    // Atomic transaction for wallet deduction and order creation
    await adminDb.runTransaction(async (transaction) => {
      const userRef = adminDb.collection("users").doc(user.id);
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists) {
        throw new Error("User profile not found.");
      }

      const balance = Number(userDoc.data()?.walletBalance || 0);
      if (balance < totalAmount) {
        throw new Error("Insufficient wallet balance for this purchase.");
      }

      // 1. Deduct balance
      transaction.update(userRef, {
        walletBalance: balance - totalAmount,
        updatedAt: new Date().toISOString()
      });

      // 2. Create individual orders
      for (const p of products) {
        const orderRef = adminDb.collection("orders").doc();
        transaction.set(orderRef, {
            userId: user.id,
            productId: p.id,
            productName: p.name,
            productSlug: p.slug,
            deliveryMode: p.deliveryMode || "direct_credentials",
            customerDeliveryEmail: String(customerDeliveryEmail || "").trim() || null,
            amount: p.salePrice || p.price,
            status: "paid",
            paymentMethod: "wallet",
            walletDeducted: p.salePrice || p.price,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        orderIds.push(orderRef.id);
      }
    });

    // 3. Trigger fulfillment for all paid orders
    const fulfillmentPromises = orderIds.map((orderId, i) => fulfillPaidOrder({
        orderId,
        productId: products[i].id,
        userId: user.id,
        paymentMethod: "wallet"
    }));

    await Promise.all(fulfillmentPromises);

    return NextResponse.json({
      success: true,
      orderIds
    });
  } catch (error) {
    console.error("Wallet cart checkout error:", error);
    const message = error instanceof Error ? error.message : "Wallet checkout failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
