import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";

const balanceSchema = z.object({
  userId: z.string().min(1),
  amount: z.coerce.number().positive().max(1000000),
  action: z.enum(["add", "deduct"]).default("add")
});

export async function POST(request: Request) {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const parsed = balanceSchema.parse(await request.json());
    await adminDb.runTransaction(async (transaction) => {
      const userRef = adminDb.collection("users").doc(parsed.userId);
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error("User not found.");
      }

      const current = Number(userDoc.data()?.walletBalance || 0);
      const nextBalance = parsed.action === "deduct" ? current - parsed.amount : current + parsed.amount;
      if (nextBalance < 0) {
        throw new Error("Insufficient user balance for deduction.");
      }

      transaction.update(userRef, {
        walletBalance: nextBalance,
        updatedAt: new Date().toISOString()
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to add balance." },
      { status: 400 }
    );
  }
}
