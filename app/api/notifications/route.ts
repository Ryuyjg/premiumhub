import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const snapshot = await adminDb
    .collection("notifications")
    .where("userId", "==", user.id)
    .limit(30)
    .get();
  const notifications = snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => (String(a.createdAt || "") > String(b.createdAt || "") ? -1 : 1));
  return NextResponse.json(notifications);
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const id = String(body.id || "");

  if (id) {
    const ref = adminDb.collection("notifications").doc(id);
    const doc = await ref.get();
    if (!doc.exists || String(doc.data()?.userId) !== user.id) {
      return NextResponse.json({ error: "Notification not found." }, { status: 404 });
    }
    await ref.update({ read: true });
    return NextResponse.json({ success: true });
  }

  const snapshot = await adminDb
    .collection("notifications")
    .where("userId", "==", user.id)
    .where("read", "==", false)
    .limit(100)
    .get();

  if (snapshot.empty) {
    return NextResponse.json({ success: true });
  }

  const batch = adminDb.batch();
  snapshot.docs.forEach((doc) => batch.update(doc.ref, { read: true }));
  await batch.commit();
  return NextResponse.json({ success: true });
}
