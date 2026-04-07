import { adminDb } from "@/lib/firebase/admin";
import { decryptSensitiveValue } from "@/lib/crypto";

type FulfillOrderInput = {
  orderId: string;
  productId: string;
  userId: string;
  metadata?: {
    ip?: string;
    userAgent?: string;
    device?: string;
  };
  razorpayPaymentId?: string;
  paymentMethod?: "razorpay" | "wallet";
};

export async function createUserNotification(userId: string, title: string, message: string) {
  await adminDb.collection("notifications").add({
    userId,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString()
  });
}

type OttAccountDoc = {
  id: string;
  label: string;
  emailCiphertext: string;
  passwordCiphertext: string;
  maxUsers: number;
  activeUsers: number;
};

export async function releaseOttAccountSeat(accountId: string) {
  return adminDb.runTransaction(async (transaction) => {
    const ref = adminDb.collection("ottAccounts").doc(accountId);
    const doc = await transaction.get(ref);
    if (!doc.exists) {
      return;
    }

    const data = doc.data()!;
    const maxUsers = Math.max(Number(data.maxUsers || 1), 1);
    const nextActiveUsers = Math.max(Number(data.activeUsers || 0) - 1, 0);
    const nextStatus = data.status === "disabled" ? "disabled" : nextActiveUsers >= maxUsers ? "full" : "available";

    transaction.update(ref, {
      activeUsers: nextActiveUsers,
      status: nextStatus,
      updatedAt: new Date().toISOString()
    });
  });
}

export async function assignOttAccountSeat(productId: string): Promise<OttAccountDoc | null> {
  const accountsQuery = adminDb
    .collection("ottAccounts")
    .where("productId", "==", productId)
    .where("status", "==", "available");

  return adminDb.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(accountsQuery);
    const candidate = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => Number(a.activeUsers || 0) - Number(b.activeUsers || 0))
      .find((doc) => Number(doc.activeUsers || 0) < Number(doc.maxUsers || 1));

    if (!candidate) {
      return null;
    }

    const nextActiveUsers = Number(candidate.activeUsers || 0) + 1;
    const maxUsers = Number(candidate.maxUsers || 1);

    transaction.update(adminDb.collection("ottAccounts").doc(candidate.id), {
      activeUsers: nextActiveUsers,
      status: nextActiveUsers >= maxUsers ? "full" : "available",
      updatedAt: new Date().toISOString()
    });

    return {
      id: candidate.id,
      label: String(candidate.label || ""),
      emailCiphertext: String(candidate.emailCiphertext || ""),
      passwordCiphertext: String(candidate.passwordCiphertext || ""),
      maxUsers,
      activeUsers: nextActiveUsers
    } satisfies OttAccountDoc;
  });
}

export async function fulfillPaidOrder(input: FulfillOrderInput) {
  const { orderId, productId, userId, metadata, razorpayPaymentId, paymentMethod = "razorpay" } = input;
  const [productDoc, orderDoc] = await Promise.all([
    adminDb.collection("products").doc(productId).get(),
    adminDb.collection("orders").doc(orderId).get()
  ]);

  if (!productDoc.exists || !orderDoc.exists) {
    throw new Error("Order or product missing.");
  }

  const product = productDoc.data()!;
  const order = orderDoc.data()!;
  const deliveryMode = String(order.deliveryMode || product.deliveryMode || "direct_credentials") as
    | "direct_credentials"
    | "otp_manual"
    | "email_invite";

  if (order.userId !== userId || order.productId !== productId) {
    throw new Error("Order mismatch.");
  }

  const existingSubscription = await adminDb
    .collection("subscriptions")
    .where("orderId", "==", orderId)
    .limit(1)
    .get();

  if (!existingSubscription.empty) {
    return { success: true, idempotent: true };
  }

  const ottAccount = deliveryMode === "direct_credentials" ? await assignOttAccountSeat(productId) : null;
  if (deliveryMode === "direct_credentials" && !ottAccount) {
    throw new Error("No stock available for this item.");
  }
  const startsAt = new Date();
  const expiresAt = new Date(Date.now() + Number(product.durationInDays || 30) * 24 * 60 * 60 * 1000);

  await adminDb.collection("orders").doc(orderId).set(
    {
      status: "paid",
      paymentMethod,
      razorpayPaymentId: razorpayPaymentId || null,
      metadata: {
        ip: metadata?.ip || "unknown",
        userAgent: metadata?.userAgent || "unknown",
        device: metadata?.device || "unknown"
      },
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  let credentialsText = "";
  if (deliveryMode === "direct_credentials" && ottAccount) {
    try {
      const email = decryptSensitiveValue(ottAccount.emailCiphertext);
      const password = decryptSensitiveValue(ottAccount.passwordCiphertext);
      credentialsText = `ID: ${ottAccount.label}\nEmail: ${email}\nPassword: ${password}`;
    } catch (err) {
      console.error("Fulfillment decryption error:", err);
      credentialsText = `${ottAccount.label} - Assigned (View in dashboard)`;
    }
  } else if (deliveryMode === "otp_manual") {
    credentialsText = `OTP login. Contact admin on ${String(product.otpSupportNumber || "configured number")}`;
  } else {
    credentialsText = `Invitation will be activated on ${String(order.customerDeliveryEmail || userId)}`;
  }

  await adminDb.collection("subscriptions").add({
    userId,
    productId,
    orderId,
    productName: product.name,
    status: "active",
    startsAt: startsAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    deliveryMode,
    otpSupportNumber: String(product.otpSupportNumber || ""),
    deliveryNotes: String(product.deliveryNotes || ""),
    customerDeliveryEmail: String(order.customerDeliveryEmail || userId),
    ottAccountId: ottAccount?.id || null,
    assignedCredentialLabel: credentialsText
  });

  if (ottAccount) {
    await adminDb.collection("orderFulfillments").add({
      userId,
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

  await createUserNotification(
    userId,
    "Subscription activated",
    deliveryMode === "direct_credentials"
      ? `Your ${product.name} subscription is active now.`
      : deliveryMode === "otp_manual"
        ? `Your ${product.name} access is ready. OTP will be shared manually by admin.`
        : `Your ${product.name} invitation request has been received and will be activated soon.`
  );

  return { success: true, idempotent: false };
}
