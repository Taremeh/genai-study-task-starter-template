import { createShopifyClient } from "./shopify"
import { getDemoCategories, getDemoSingleCategory } from "@enterprise-commerce/web/utils/demoUtils"

type Strategy = "shopify"

interface CreateStorefrontClientProps {
  strategy: Strategy
  storeDomain: string
  storefrontAccessToken?: string
  adminAccessToken?: string
}

export function createStorefrontClient({ storefrontAccessToken, adminAccessToken, storeDomain, strategy }: CreateStorefrontClientProps) {
  switch (strategy) {
    case "shopify":
      let client = createShopifyClient({ storeDomain, storefrontAccessToken, adminAccessToken })
      client.getCollections = async () => { return getDemoCategories() }
      client.getCollection = async (slug) => { return getDemoSingleCategory(slug) }
      return client
    default:
      throw new Error("Unknown strategy used for creating storefront client")
  }
}
