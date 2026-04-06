import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { AppUser } from "@/types";

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "ott_session";

export async function getSessionCookie() {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value;
}

export async function getCurrentUser() {
  const sessionCookie = await getSessionCookie();
  if (!sessionCookie) {
    return null;
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();

    return {
      id: decoded.uid,
      email: decoded.email || "",
      displayName: decoded.name,
      role: (userDoc.data()?.role || "user") as AppUser["role"]
    } satisfies AppUser;
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") {
    redirect("/");
  }
  return user;
}
