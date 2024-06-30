import "server-only"

import { createStorefrontClient } from "@enterprise-commerce/core/platform"
import { env } from "../env.mjs"
import { Product } from "../../api/src/types/product.types"
// export const storefrontClient = createStorefrontClient({
//   strategy: "shopify",
//   storeDomain: env.SHOPIFY_STORE_DOMAIN || "",
//   storefrontAccessToken: env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "",
//   adminAccessToken: env.SHOPIFY_ADMIN_ACCESS_TOKEN || "",
// })


export const storefrontClient = () => {

};

export const getCart = (cartId: string): Product[] => {
  // const product: Product = {
  //   id: "1",
  //   handle: "handle",
  //   title: "title",
  //   priceRange: {
  //     maxVariantPrice: {
  //       amount: "1",
  //       currencyCode: "USD",
  //     },
  //     minVariantPrice: {
  //       amount: "1",
  //       currencyCode: "USD",
  //     },
  //   },
  //   minPrice: 1,
  //   featuredImage: {
  //     url: "url",
  //     altText: "altText",
  //     width: 1,
  //     height: 1,
  //   },
  //   images: [],
  //   variants: [],
  //   collections: [],
  // };

  return []
}



