import fetch from 'node-fetch';
import { PlatformProduct } from "@enterprise-commerce/core/platform/types";
import { env } from "env.mjs";

const DEMO_PRODUCTS_API_URL = "http://localhost:3001/products";
const DEMO_CATEGORIES_API_URL = "http://localhost:3001/categories";

export async function getDemoProducts() {
  if (!isDemoMode()) {
    return { hits: [], totalPages: 0, facetDistribution: {}, totalHits: 0 };
  }

  try {
    const response = await fetch(DEMO_PRODUCTS_API_URL);
    const data = await response.json();

    return {
      hits: data.results as PlatformProduct[],
      totalPages: 1,
      facetDistribution: {},
      totalHits: data.results.length as number,
    };
  } catch (error) {
    console.error("Error fetching demo products:", error);
    return { hits: [], totalPages: 0, facetDistribution: {}, totalHits: 0 };
  }
}

export async function getDemoSingleProduct(handle: string) {
  const products = await getDemoProducts();
  return products.hits.find((p) => p.handle === handle) || null;
}

export async function getDemoCategories() {
  if (!isDemoMode()) {
    return [];
  }

  try {
    const response = await fetch(DEMO_CATEGORIES_API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching demo categories:", error);
    return [];
  }
}

export async function getDemoSingleCategory(handle: string) {
  const categories = await getDemoCategories();
  return categories.find((c) => c.handle === handle) || null;
}

export function isDemoMode() {
  return (
    !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
    !process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ||
    !process.env.SHOPIFY_APP_API_SECRET_KEY ||
    !process.env.SHOPIFY_STORE_DOMAIN ||
    !process.env.MEILISEARCH_HOST ||
    !process.env.MEILISEARCH_MASTER_KEY ||
    !process.env.LIVE_URL ||
    env.IS_DEMO_MODE === "true"
  );
}
