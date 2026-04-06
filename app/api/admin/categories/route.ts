import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { slugify } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  accent: z.string().optional()
});

export async function POST(request: Request) {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const parsed = categorySchema.parse(await request.json());
  const ref = await adminDb.collection("categories").add({
    ...parsed,
    slug: slugify(parsed.name)
  });

  return NextResponse.json({ id: ref.id });
}
