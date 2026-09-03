"use client";

import type { Category, Product } from "@/types";

const CATEGORIES_KEY = "ott_categories_v2";
const PRODUCTS_KEY = "ott_products_v2";
export const CATALOG_UPDATED_EVENT = "ott_catalog_updated";

export function getStoredCategories(fallback: Category[]): Category[] {
  if (typeof window === "undefined") {
    return fallback;
  }
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Fall back to props
  }
  return fallback;
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

export function getStoredProducts(fallback: Product[]): Product[] {
  if (typeof window === "undefined") {
    return fallback;
  }
  try {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Fall back to props
  }
  return fallback;
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

export function resetStoredCatalog(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CATEGORIES_KEY);
    localStorage.removeItem(PRODUCTS_KEY);
    window.dispatchEvent(new CustomEvent(CATALOG_UPDATED_EVENT));
  } catch (error) {
    console.error("Failed to reset catalog storage:", error);
  }
}
