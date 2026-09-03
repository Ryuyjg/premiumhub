"use client";

import type { Category, Product } from "@/types";
import { slugify } from "@/lib/utils";

const CATEGORIES_KEY = "ott_categories_v3";
const DELETED_CATEGORIES_KEY = "ott_deleted_category_slugs_v3";
const PRODUCTS_KEY = "ott_products_v3";
const DELETED_PRODUCTS_KEY = "ott_deleted_product_ids_v3";

export const CATALOG_UPDATED_EVENT = "ott_catalog_updated";

function getDeletedCategorySlugs(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(DELETED_CATEGORIES_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return new Set(arr.map(String));
      }
    }
  } catch {
    // Fallback empty
  }
  return new Set();
}

function saveDeletedCategorySlugs(slugs: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DELETED_CATEGORIES_KEY, JSON.stringify(Array.from(slugs)));
  } catch {
    // Ignore error
  }
}

function getDeletedProductIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(DELETED_PRODUCTS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        return new Set(arr.map(String));
      }
    }
  } catch {
    // Fallback empty
  }
  return new Set();
}

function saveDeletedProductIds(ids: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DELETED_PRODUCTS_KEY, JSON.stringify(Array.from(ids)));
  } catch {
    // Ignore error
  }
}

export function getStoredCategories(fallback: Category[]): Category[] {
  if (typeof window === "undefined") {
    return fallback;
  }
  const deletedSlugs = getDeletedCategorySlugs();

  let list: Category[] = fallback;
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        list = parsed;
      }
    }
  } catch {
    list = fallback;
  }

  // Filter out any items in deleted list
  return list.filter((cat) => {
    const catSlug = slugify(cat.slug || cat.name || cat.id);
    const catId = cat.id;
    return !deletedSlugs.has(catSlug) && !deletedSlugs.has(catId) && !deletedSlugs.has(cat.name.toLowerCase());
  });
}

export function saveStoredCategories(categories: Category[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent(CATALOG_UPDATED_EVENT));
  } catch (error) {
    console.error("Failed to save categories to local storage:", error);
  }
}

export function recordDeletedCategory(category: Category): void {
  if (typeof window === "undefined") return;
  const deletedSlugs = getDeletedCategorySlugs();
  if (category.id) deletedSlugs.add(category.id);
  if (category.slug) deletedSlugs.add(category.slug);
  if (category.name) deletedSlugs.add(slugify(category.name));
  saveDeletedCategorySlugs(deletedSlugs);
}

export function getStoredProducts(fallback: Product[]): Product[] {
  if (typeof window === "undefined") {
    return fallback;
  }
  const deletedIds = getDeletedProductIds();

  let list: Product[] = fallback;
  try {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        list = parsed;
      }
    }
  } catch {
    list = fallback;
  }

  return list.filter((prod) => !deletedIds.has(prod.id) && !deletedIds.has(prod.slug));
}

export function saveStoredProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent(CATALOG_UPDATED_EVENT));
  } catch (error) {
    console.error("Failed to save products to local storage:", error);
  }
}

export function recordDeletedProduct(product: Pick<Product, "id" | "slug">): void {
  if (typeof window === "undefined") return;
  const deletedIds = getDeletedProductIds();
  if (product.id) deletedIds.add(product.id);
  if (product.slug) deletedIds.add(product.slug);
  saveDeletedProductIds(deletedIds);
}

export function resetStoredCatalog(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CATEGORIES_KEY);
    localStorage.removeItem(DELETED_CATEGORIES_KEY);
    localStorage.removeItem(PRODUCTS_KEY);
    localStorage.removeItem(DELETED_PRODUCTS_KEY);
    window.dispatchEvent(new CustomEvent(CATALOG_UPDATED_EVENT));
  } catch (error) {
    console.error("Failed to reset catalog storage:", error);
  }
}
