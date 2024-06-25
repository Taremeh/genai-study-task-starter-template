import { env } from "env.mjs"
import { MeiliSearch, Meilisearch } from "meilisearch"

const meilisearchClientSingleton = () => {
  const client = new MeiliSearch({
    host: env.MEILISEARCH_HOST || "",
    apiKey: env.MEILISEARCH_MASTER_KEY || "",
  })
  meilisearchSetup(client)
  return client
}

const meilisearchSetup = async (client: MeiliSearch) => {
  console.log("Beginning to set up Meilisearch product's table...")

  client.getIndex('products').then((index) => {
    console.log(`Index 'products' already exists with uid ${index.uid}`)
  }).catch(async () => {
    const demoData = await import('@enterprise-commerce/web/public/demo-data.json')
    const products = demoData['results']
    // Automatically create and populate 'products' index
    client.index('products').addDocuments(products)
      .then((res) => console.log(res))

    const settings = {
      "filterableAttributes": ["collections", "collections.title", "flatOptions", "handle", "minPrice", "tags", "variants.availableForSale", "vendor"],
      "sortableAttributes": ["minPrice", "updatedAtTimestamp"],
      "rankingRules":
        [
          "sort",
          "words",
          "typo",
          "proximity",
          "attribute",
          "exactness"
        ]
    }
  
    client.index('products').updateSettings(settings)
      .then((res) => console.log(res))
    
  }).then(() => {
    console.log("Finished setting up Meilisearch product's table.")
  })
}

declare global {
  var meilisearch: undefined | ReturnType<typeof meilisearchClientSingleton>
}

const meilisearch = globalThis.meilisearch ?? meilisearchClientSingleton()

export { meilisearch }

if (process.env.NODE_ENV !== "production") globalThis.meilisearch = meilisearch
