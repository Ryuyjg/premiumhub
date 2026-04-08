import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthorized } from "@/lib/auth";
import { adminDb } from "@/lib/firebase/admin";
import { EDITABLE_SITE_PAGE_SLUGS } from "@/lib/site-content-defaults";

const sectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim(),
  description: z.string().trim(),
  href: z.string().trim().optional(),
  ctaLabel: z.string().trim().optional()
});

const pageSchema = z.object({
  id: z.string().min(1),
  slug: z.enum(EDITABLE_SITE_PAGE_SLUGS),
  label: z.string().min(2),
  eyebrow: z.string().min(2),
  title: z.string().min(2),
  description: z.string().min(2),
  body: z.string().default(""),
  sections: z.array(sectionSchema).default([])
});

export async function PUT(request: Request) {
  const allowed = await isAdminAuthorized();
  if (!allowed) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const parsed = pageSchema.parse(await request.json());
    const timestamp = new Date().toISOString();

    await adminDb.collection("sitePages").doc(parsed.id).set(
      {
        slug: parsed.slug,
        label: parsed.label.trim(),
        eyebrow: parsed.eyebrow.trim(),
        title: parsed.title.trim(),
        description: parsed.description.trim(),
        body: parsed.body.trim(),
        sections: parsed.sections.map((section) => ({
          id: section.id,
          title: section.title.trim(),
          description: section.description.trim(),
          href: section.href?.trim() || "",
          ctaLabel: section.ctaLabel?.trim() || ""
        })),
        updatedAt: timestamp
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save page." },
      { status: 400 }
    );
  }
}
