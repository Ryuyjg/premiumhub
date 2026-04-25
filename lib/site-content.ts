import { adminDb } from "@/lib/firebase/admin";
import {
  DEFAULT_SITE_PAGES,
  DEFAULT_SUPPORT_CHANNELS,
  EDITABLE_SITE_PAGE_SLUGS,
  sortSitePages,
  sortSupportChannels
} from "@/lib/site-content-defaults";
import { normalizeSupportHref } from "@/lib/url-normalize";
import type { SitePage, SitePageSection, SupportChannel } from "@/types";

function sanitizeSections(value: unknown): SitePageSection[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((section, index) => {
      if (!section || typeof section !== "object" || Array.isArray(section)) {
        return null;
      }

      const record = section as Record<string, unknown>;
      const title = String(record.title || "").trim();
      const description = String(record.description || "").trim();

      if (!title && !description) {
        return null;
      }

      return {
        id: String(record.id || `section-${index + 1}`),
        title,
        description,
        href: normalizeSupportHref(String(record.href || "").trim(), ""),
        ctaLabel: String(record.ctaLabel || "").trim()
      };
    })
    .filter(Boolean) as SitePageSection[];
}

function normalizePage(id: string, data: Record<string, unknown>): SitePage {
  return {
    id,
    slug: String(data.slug || id),
    label: String(data.label || ""),
    footerGroup: (data.footerGroup || "company") as SitePage["footerGroup"],
    order: Number(data.order || 0),
    eyebrow: String(data.eyebrow || ""),
    title: String(data.title || ""),
    description: String(data.description || ""),
    body: String(data.body || ""),
    layout: (data.layout || "cards") as SitePage["layout"],
    showSupportChannels: Boolean(data.showSupportChannels),
    sections: sanitizeSections(data.sections),
    createdAt: String(data.createdAt || ""),
    updatedAt: String(data.updatedAt || "")
  };
}

function normalizeSupportChannel(id: string, data: Record<string, unknown>): SupportChannel {
  return {
    id,
    title: String(data.title || ""),
    description: String(data.description || ""),
    href: normalizeSupportHref(String(data.href || "")),
    buttonLabel: String(data.buttonLabel || "Open"),
    order: Number(data.order || 0),
    active: data.active !== false,
    createdAt: String(data.createdAt || ""),
    updatedAt: String(data.updatedAt || "")
  };
}

async function ensureDefaultSitePages(pages: SitePage[]) {
  const existing = new Set(pages.map((page) => page.slug));
  const missing = DEFAULT_SITE_PAGES.filter((page) => !existing.has(page.slug));

  if (!missing.length) {
    return pages;
  }

  const batch = adminDb.batch();
  const timestamp = new Date().toISOString();

  missing.forEach((page) => {
    const ref = adminDb.collection("sitePages").doc(page.slug);
    batch.set(
      ref,
      {
        ...page,
        sections: page.sections || [],
        createdAt: timestamp,
        updatedAt: timestamp
      },
      { merge: true }
    );
  });

  await batch.commit();

  return sortSitePages([
    ...pages,
    ...missing.map((page) => ({
      id: page.slug,
      ...page,
      createdAt: timestamp,
      updatedAt: timestamp
    }))
  ]);
}

async function ensureDefaultSupportChannels(channels: SupportChannel[]) {
  if (channels.length) {
    return channels;
  }

  const metaRef = adminDb.collection("siteContentMeta").doc("support-channels");
  const metaDoc = await metaRef.get();
  if (metaDoc.exists && metaDoc.data()?.initialized === true) {
    return [];
  }

  const batch = adminDb.batch();
  const timestamp = new Date().toISOString();

  DEFAULT_SUPPORT_CHANNELS.forEach((channel, index) => {
    const ref = adminDb.collection("supportChannels").doc(`seed-${index + 1}`);
    batch.set(
      ref,
      {
        ...channel,
        createdAt: timestamp,
        updatedAt: timestamp
      },
      { merge: true }
    );
  });
  batch.set(
    metaRef,
    {
      initialized: true,
      updatedAt: timestamp
    },
    { merge: true }
  );

  await batch.commit();

  return DEFAULT_SUPPORT_CHANNELS.map((channel, index) => ({
    id: `seed-${index + 1}`,
    ...channel,
    createdAt: timestamp,
    updatedAt: timestamp
  }));
}

function mergeFallbackPages(pages: SitePage[]) {
  const existing = new Set(pages.map((page) => page.slug));
  const missing = DEFAULT_SITE_PAGES.filter((page) => !existing.has(page.slug));

  if (!missing.length) {
    return sortSitePages(pages);
  }

  const timestamp = new Date().toISOString();
  return sortSitePages([
    ...pages,
    ...missing.map((page) => ({
      id: page.slug,
      ...page,
      createdAt: timestamp,
      updatedAt: timestamp
    }))
  ]);
}

export async function getSitePages() {
  let pages: SitePage[] = [];

  try {
    const snapshot = await adminDb.collection("sitePages").get();
    pages = snapshot.docs.map((doc) => normalizePage(doc.id, doc.data() as Record<string, unknown>));
  } catch {
    pages = [];
  }

  let completePages = pages;
  try {
    completePages = await ensureDefaultSitePages(pages);
  } catch {
    // Never crash policy/support pages because of seeding failures.
    completePages = mergeFallbackPages(pages);
  }

  return sortSitePages(
    completePages.filter((page) => EDITABLE_SITE_PAGE_SLUGS.includes(page.slug as (typeof EDITABLE_SITE_PAGE_SLUGS)[number]))
  );
}

export async function getSitePage(slug: string) {
  const pages = await getSitePages();
  return pages.find((page) => page.slug === slug) || null;
}

export function getDefaultSitePage(slug: string) {
  const page = DEFAULT_SITE_PAGES.find((item) => item.slug === slug);
  if (!page) {
    return null;
  }

  const timestamp = new Date().toISOString();
  return {
    id: page.slug,
    ...page,
    createdAt: timestamp,
    updatedAt: timestamp
  } satisfies SitePage;
}

export async function getSitePageOrDefault(slug: string): Promise<SitePage> {
  const fallback = getDefaultSitePage(slug) || getDefaultSitePage("support-channels")!;
  try {
    return (await getSitePage(slug)) || fallback;
  } catch {
    return fallback;
  }
}

export async function getSupportChannels() {
  let channels: SupportChannel[] = [];

  try {
    const snapshot = await adminDb.collection("supportChannels").get();
    channels = snapshot.docs.map((doc) => normalizeSupportChannel(doc.id, doc.data() as Record<string, unknown>));
  } catch {
    channels = [];
  }

  try {
    const completeChannels = await ensureDefaultSupportChannels(channels);
    return sortSupportChannels(completeChannels);
  } catch {
    return sortSupportChannels(channels);
  }
}

export function getDefaultSupportChannels() {
  const timestamp = new Date().toISOString();
  return DEFAULT_SUPPORT_CHANNELS.map((channel, index) => ({
    id: `default-${index + 1}`,
    ...channel,
    href: normalizeSupportHref(channel.href),
    createdAt: timestamp,
    updatedAt: timestamp
  })) satisfies SupportChannel[];
}

export async function getSupportChannelsOrDefault() {
  try {
    const channels = await getSupportChannels();
    return channels.length ? channels : getDefaultSupportChannels();
  } catch {
    return getDefaultSupportChannels();
  }
}

export async function getPublicSiteContent() {
  const [pages, supportChannels] = await Promise.all([getSitePages(), getSupportChannels()]);

  return {
    pages: pages.map((page) => ({
      id: page.id,
      slug: page.slug,
      label: page.label,
      footerGroup: page.footerGroup,
      order: page.order
    })),
    supportChannels: supportChannels.filter((channel) => channel.active)
  };
}
