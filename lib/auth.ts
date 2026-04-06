import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import type { AppUser } from "@/types";

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "ott_session";
const ADMIN_SESSION_COOKIE_NAME = process.env.ADMIN_SESSION_COOKIE_NAME || "ott_admin";
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || process.env.OTT_CREDENTIAL_SECRET || "admin-fallback-secret";
const ADMIN_LOGIN_EMAIL = process.env.ADMIN_LOGIN_EMAIL;

function signAdminEmail(email: string) {
  return crypto.createHmac("sha256", ADMIN_SESSION_SECRET).update(email).digest("hex");
}

export function createAdminCookieValue(email: string) {
  return `${email}.${signAdminEmail(email)}`;
}

export function verifyAdminCookieValue(value?: string) {
  if (!value) {
    return false;
  }

  const [email, signature] = value.split(".");
  if (!email || !signature || !ADMIN_LOGIN_EMAIL) {
    return false;
  }

  return email === ADMIN_LOGIN_EMAIL && signature === signAdminEmail(email);
}

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

export async function isAdminAuthorized() {
  const adminCookie = (await cookies()).get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (verifyAdminCookieValue(adminCookie)) {
    return true;
  }

  const user = await getCurrentUser();
  return !!user && user.role === "admin";
}

export async function requireAdmin() {
  const authorized = await isAdminAuthorized();
  if (!authorized) {
    redirect("/");
  }
  return {
    id: "admin",
    email: ADMIN_LOGIN_EMAIL || "admin",
    role: "admin"
  } satisfies AppUser;
}
