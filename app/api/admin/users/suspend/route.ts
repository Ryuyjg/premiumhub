import { NextResponse } from "next/server";
import { isAdminAuthorized } from "@/lib/auth";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { z } from "zod";

const suspendSchema = z.object({
  userId: z.string().min(1),
  suspend: z.boolean()
});

export async function POST(request: Request) {
  try {
    const allowed = await isAdminAuthorized();
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const body = await request.json();
    const { userId, suspend } = suspendSchema.parse(body);
    
    // Disable or Enable in Firebase Auth globally
    await adminAuth.updateUser(userId, { disabled: suspend });
    
    // Update in Firestore to show on Dashboard and block app usage via rule sync
    await adminDb.collection("users").doc(userId).update({
      suspended: suspend,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true, suspended: suspend });
  } catch (error) {
    console.error("User suspend error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to alter suspension status." },
      { status: 400 }
    );
  }
}
