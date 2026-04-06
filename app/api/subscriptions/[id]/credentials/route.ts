import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { decryptSensitiveValue } from "@/lib/crypto";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  const subscriptionDoc = await adminDb.collection("subscriptions").doc(id).get();
  if (!subscriptionDoc.exists) {
    return NextResponse.json({ error: "Subscription not found." }, { status: 404 });
  }

  const subscription = subscriptionDoc.data()!;
  if (subscription.userId !== user.id) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  if (!subscription.ottAccountId) {
    return NextResponse.json({ error: "Credentials are pending assignment." }, { status: 404 });
  }

  const accountDoc = await adminDb.collection("ottAccounts").doc(subscription.ottAccountId).get();
  if (!accountDoc.exists) {
    return NextResponse.json({ error: "Assigned account missing." }, { status: 404 });
  }

  const account = accountDoc.data()!;

  return NextResponse.json({
    provider: account.provider,
    label: account.label,
    email: decryptSensitiveValue(account.emailCiphertext),
    password: decryptSensitiveValue(account.passwordCiphertext)
  });
}
