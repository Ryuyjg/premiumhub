import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { fulfillUroPayOrders } from "@/lib/uropay-order-sync";
import { verifyUroPayWebhookSignature } from "@/lib/uropay";

export async function POST(request: Request) {
  try {
    const environment = String(request.headers.get("x-uropay-environment") || "").trim();
    const signature = String(request.headers.get("x-uropay-signature") || "").trim();
    const payload = await request.json().catch(() => ({}));

    if (!environment || !signature || typeof payload !== "object" || payload === null) {
      return NextResponse.json({ error: "Invalid webhook payload." }, { status: 400 });
    }

    if (!verifyUroPayWebhookSignature(payload as Record<string, unknown>, environment, signature)) {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
    }

    const referenceNumber = String((payload as Record<string, unknown>).referenceNumber || "").trim();
    const amount = Number((payload as Record<string, unknown>).amount || 0);

    if (!referenceNumber || amount <= 0) {
      return NextResponse.json({ success: true, ignored: true });
    }

    const orderSnapshot = await adminDb.collection("orders").where("gatewayPaymentId", "==", referenceNumber).get();
    const matchingOrders = orderSnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() || {}) }));

    if (matchingOrders.length === 0) {
      return NextResponse.json({ success: true, matched: 0 });
    }

    const result = await fulfillUroPayOrders(matchingOrders, {
      ip: request.headers.get("x-forwarded-for") || "unknown",
      userAgent: "uropay-webhook",
      device: environment
    });

    return NextResponse.json({ success: true, matched: matchingOrders.length, fulfilled: result.fulfilled });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
