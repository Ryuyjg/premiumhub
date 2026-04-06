import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import {
  assignOttAccountSeat,
  createUserNotification,
  releaseOttAccountSeat
} from "@/lib/order-fulfillment";

const orderActionSchema = z.object({
  orderId: z.string().min(1),
  action: z.enum(["refund", "replace"])
});

export async function POST(request: Request) {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const parsed = orderActionSchema.parse(await request.json());
    const orderRef = adminDb.collection("orders").doc(parsed.orderId);
    const orderDoc = await orderRef.get();
    if (!orderDoc.exists) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const order = orderDoc.data()!;
    if (order.status !== "paid") {
      return NextResponse.json({ error: "Only paid orders can be changed." }, { status: 400 });
    }

    const subscriptionSnapshot = await adminDb
      .collection("subscriptions")
      .where("orderId", "==", parsed.orderId)
      .limit(1)
      .get();
    const subscriptionDoc = subscriptionSnapshot.empty ? null : subscriptionSnapshot.docs[0];

    if (parsed.action === "refund") {
      if (order.refundedAt) {
        return NextResponse.json({ error: "Order already refunded." }, { status: 400 });
      }

      await adminDb.runTransaction(async (transaction) => {
        const userRef = adminDb.collection("users").doc(order.userId);
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
          throw new Error("User not found.");
        }
        const currentBalance = Number(userDoc.data()?.walletBalance || 0);
        transaction.update(userRef, {
          walletBalance: currentBalance + Number(order.amount || 0),
          updatedAt: new Date().toISOString()
        });
        transaction.update(orderRef, {
          status: "refunded",
          refundedAt: new Date().toISOString(),
          refundMethod: "wallet",
          updatedAt: new Date().toISOString()
        });
      });

      if (subscriptionDoc?.exists) {
        const subscription = subscriptionDoc.data()!;
        await adminDb.collection("subscriptions").doc(subscriptionDoc.id).set(
          {
            status: "cancelled",
            updatedAt: new Date().toISOString()
          },
          { merge: true }
        );
        if (subscription.ottAccountId) {
          await releaseOttAccountSeat(String(subscription.ottAccountId));
        }
      }

      await createUserNotification(
        String(order.userId),
        "Refund processed",
        `Refund for ${order.productName} has been credited to your wallet.`
      );

      return NextResponse.json({ success: true });
    }

    if (!subscriptionDoc?.exists) {
      return NextResponse.json({ error: "No subscription found for this order." }, { status: 404 });
    }

    const subscription = subscriptionDoc.data()!;
    const newAccount = await assignOttAccountSeat(String(order.productId));
    if (!newAccount) {
      return NextResponse.json({ error: "No replacement account available right now." }, { status: 400 });
    }

    const previousAccountId = subscription.ottAccountId ? String(subscription.ottAccountId) : "";
    if (previousAccountId && previousAccountId !== newAccount.id) {
      await releaseOttAccountSeat(previousAccountId);
    }

    await adminDb.collection("subscriptions").doc(subscriptionDoc.id).set(
      {
        ottAccountId: newAccount.id,
        assignedCredentialLabel: `${newAccount.label} reassigned`,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );

    await adminDb.collection("orderFulfillments").add({
      userId: order.userId,
      orderId: parsed.orderId,
      ottAccountId: newAccount.id,
      action: "replace",
      deliveredAt: new Date().toISOString()
    });

    await createUserNotification(
      String(order.userId),
      "Account replaced",
      `A new account has been assigned for ${order.productName}.`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to perform order action." },
      { status: 400 }
    );
  }
}
