import { NextResponse } from "next/server";
import { getCurrentUser, isAdminAuthorized } from "@/lib/auth";

export async function GET() {
  const [user, adminAuthorized] = await Promise.all([getCurrentUser(), isAdminAuthorized()]);

  if (user) {
    return NextResponse.json({
      authenticated: true,
      role: user.role || "user",
      email: user.email || ""
    });
  }

  if (adminAuthorized) {
    return NextResponse.json({
      authenticated: true,
      role: "admin",
      email: ""
    });
  }

  return NextResponse.json({
    authenticated: false,
    role: "guest",
    email: ""
  });
}
