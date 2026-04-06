import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { isAdminAuthorized } from "@/lib/auth";
import { encryptSensitiveValue } from "@/lib/crypto";
import { adminDb } from "@/lib/firebase/admin";

const accountSchema = z.object({
  productId: z.string().min(1),
  provider: z.string().trim().min(1, "Provider is required."),
  email: z.string().email(),
  password: z.string().min(4),
  maxUsers: z.number().int().positive(),
  label: z.string().trim().min(1, "Label is required.")
});

const updateAccountSchema = z.object({
  id: z.string().min(1),
  maxUsers: z.number().int().positive().optional(),
  status: z.enum(["available", "full", "disabled"]).optional()
});

export async function POST(request: Request) {
  try {
    const allowed = await isAdminAuthorized();
    if (!allowed) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    
    // Validate request body
    const body = await request.json();
    const parsed = accountSchema.parse(body);
    
    const ref = await adminDb.collection("ottAccounts").add({
      productId: parsed.productId,
      provider: parsed.provider,
      emailCiphertext: encryptSensitiveValue(parsed.email),
      passwordCiphertext: encryptSensitiveValue(parsed.password),
      maxUsers: parsed.maxUsers,
      activeUsers: 0,
      label: parsed.label,
      status: "available"
    });
    
    return NextResponse.json({ id: ref.id });
  } catch (error) {
    console.error("Account store error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Please check all fields." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to store account. Please check all fields." },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const parsed = updateAccountSchema.parse(await request.json());
    const accountRef = adminDb.collection("ottAccounts").doc(parsed.id);
    const accountDoc = await accountRef.get();
    if (!accountDoc.exists) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    const current = accountDoc.data()!;
    const nextMaxUsers = parsed.maxUsers ?? Number(current.maxUsers || 1);
    const nextStatus =
      parsed.status ||
      (Number(current.activeUsers || 0) >= nextMaxUsers ? "full" : "available");

    await accountRef.update({
      maxUsers: nextMaxUsers,
      status: nextStatus,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update account." },
      { status: 400 }
    );
  }
}
