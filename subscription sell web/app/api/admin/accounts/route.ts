import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { encryptSensitiveValue } from "@/lib/crypto";
import { adminDb } from "@/lib/firebase/admin";

const accountSchema = z.object({
  productId: z.string().min(1),
  provider: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(4),
  maxUsers: z.number().int().positive(),
  label: z.string().min(2)
});

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }
  const parsed = accountSchema.parse(await request.json());
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
}
