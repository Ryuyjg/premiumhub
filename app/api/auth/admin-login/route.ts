import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createAdminCookieValue } from "@/lib/auth";

const ADMIN_LOGIN_EMAIL = process.env.ADMIN_LOGIN_EMAIL;
const ADMIN_LOGIN_PASSWORD = process.env.ADMIN_LOGIN_PASSWORD;
const ADMIN_SESSION_COOKIE_NAME = process.env.ADMIN_SESSION_COOKIE_NAME || "ott_admin";
const SESSION_COOKIE_MAX_AGE = Number(process.env.SESSION_COOKIE_MAX_AGE || 60 * 60 * 24 * 5);

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!ADMIN_LOGIN_EMAIL || !ADMIN_LOGIN_PASSWORD) {
    return NextResponse.json({ error: "Admin credentials are not configured." }, { status: 500 });
  }

  if (email !== ADMIN_LOGIN_EMAIL || password !== ADMIN_LOGIN_PASSWORD) {
    return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
  }

  const adminCookieValue = createAdminCookieValue(email);
  (await cookies()).set(ADMIN_SESSION_COOKIE_NAME, adminCookieValue, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE
  });

  return NextResponse.json({ success: true });
}
