import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "ott_session";
const ADMIN_SESSION_COOKIE_NAME = process.env.ADMIN_SESSION_COOKIE_NAME || "ott_admin";
const SESSION_COOKIE_MAX_AGE = Number(process.env.SESSION_COOKIE_MAX_AGE || 60 * 60 * 24 * 5);

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token) {
    return NextResponse.json({ error: "Missing ID token." }, { status: 400 });
  }

  const decodedToken = await adminAuth.verifyIdToken(token);
  const existingUser = await adminDb.collection("users").doc(decodedToken.uid).get();
  const sessionCookie = await adminAuth.createSessionCookie(token, {
    expiresIn: SESSION_COOKIE_MAX_AGE * 1000
  });

  await adminDb.collection("users").doc(decodedToken.uid).set(
    {
      email: decodedToken.email || "",
      displayName: decodedToken.name || existingUser.data()?.displayName || "",
      role: existingUser.data()?.role || "user",
      createdAt: existingUser.data()?.createdAt || new Date().toISOString()
    },
    { merge: true }
  );

  (await cookies()).set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE
  });
  (await cookies()).delete(ADMIN_SESSION_COOKIE_NAME);

  return NextResponse.json({ success: true });
}

export async function DELETE() {
  (await cookies()).delete(SESSION_COOKIE_NAME);
  (await cookies()).delete(ADMIN_SESSION_COOKIE_NAME);
  return NextResponse.json({ success: true });
}
