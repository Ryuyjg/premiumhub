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

  try {
    const parsed = categorySchema.parse(await request.json());
    const slug = slugify(parsed.name);

    const duplicate = await adminDb.collection("categories").where("slug", "==", slug).limit(1).get();
    if (!duplicate.empty) {
      return NextResponse.json({ error: "Category already exists." }, { status: 409 });
    }

    const ref = await adminDb.collection("categories").add({
      ...parsed,
      slug
    });

    return NextResponse.json({ id: ref.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create category." },
      { status: 400 }
    );
  }
}
