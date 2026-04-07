import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userDoc = await adminDb.collection("users").doc(user.id).get();
    if (!userDoc.exists) {
        return NextResponse.json({ 
            id: user.id,
            email: user.email,
            walletBalance: 0
        });
    }

    const data = userDoc.data()!;
    return NextResponse.json({
      id: user.id,
      email: user.email,
      displayName: data.displayName || "",
      walletBalance: Number(data.walletBalance || 0),
      role: data.role || "user"
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
