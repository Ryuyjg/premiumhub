import type { Category } from "@/types";
import { slugify } from "@/lib/utils";

export const FEATURED_CATEGORY_SLUG = "telegram-auto-software";
export const MEGA_SALES_CATEGORY_SLUG = "mega-sales";

export const MEGA_SALES_NAV_ITEM = {
  name: "Mega Sales",
  slug: MEGA_SALES_CATEGORY_SLUG
} as const;

export const STARTER_CATEGORIES = [
  {
    name: "AI Plans",
    slug: "ai-plans",
    order: 0,
    description: "Premium AI tools, credits, assistants, and monthly access plans."
  },
  {
    name: "OTT Plans",
    slug: "ott-plans",
    order: 1,
    description: "Streaming access plans, renewals, and entertainment bundles."
  },
  {
    name: "Games",
    slug: "games",
    order: 2,
    description: "Gaming accounts, top-ups, subscriptions, and digital unlocks."
  },
  {
    name: "Softwares",
    slug: "softwares",
    order: 3,
    description: "Desktop tools, utility licenses, creators tools, and software access."
  },
  {
    name: "Virtual Numbers",
    slug: "virtual-numbers",
    order: 4,
    description: "Number rentals, verification-ready options, and region-based virtual lines."
  },
  {
    name: "Telegram Sessions",
    slug: "telegram-sessions",
    order: 5,
    description: "Session files, ready logins, and Telegram account access offers."
  },
  {
    name: "Telegram Auto Software",
    slug: FEATURED_CATEGORY_SLUG,
    order: 6,
    description:
      "Main product lane for Telegram automation suites, sender tools, scraping tools, growth systems, and bigger long-form listings."
  }
] as const;

const categoryOrder = new Map(STARTER_CATEGORIES.map((item, index) => [item.slug, index]));

export function getStarterCategoryMeta(slug: string) {
  return STARTER_CATEGORIES.find((item) => item.slug === slug) || null;
}

export function isFeaturedCategory(category: Pick<Category, "slug" | "name">) {
  return slugify(category.slug || category.name) === FEATURED_CATEGORY_SLUG;
}

export function sortCategories<T extends Category>(categories: T[]) {
  return [...categories].sort((a, b) => {
    const aExplicitOrder = typeof a.order === "number" ? a.order : null;
    const bExplicitOrder = typeof b.order === "number" ? b.order : null;

    if (aExplicitOrder !== null && bExplicitOrder !== null && aExplicitOrder !== bExplicitOrder) {
      return aExplicitOrder - bExplicitOrder;
    }

    if (aExplicitOrder !== null && bExplicitOrder === null) {
      return -1;
    }

    if (aExplicitOrder === null && bExplicitOrder !== null) {
      return 1;
    }

    const aSlug = slugify(a.slug || a.name || a.id);
    const bSlug = slugify(b.slug || b.name || b.id);
    const aOrder = categoryOrder.get(aSlug);
    const bOrder = categoryOrder.get(bSlug);

    if (aOrder !== undefined && bOrder !== undefined) {
      return aOrder - bOrder;
    }

    if (aOrder !== undefined) {
      return -1;
    }

    if (bOrder !== undefined) {
      return 1;
    }

    return a.name.localeCompare(b.name);
  });
}
