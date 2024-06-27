import { Request, Response } from 'express';
import openDb from '../db/db';
import { Product, Image, Variant, Option, Collection, Price } from '../types/product.types'; // Ensure the path to your types file is correct

export const getProducts = async (req: Request, res: Response) => {
  try {
    const db = await openDb();

    const products: Product[] = await db.all(`SELECT * FROM products`);

    const formattedProducts: Product[] = products.map((row: any) => ({
      id: row.id,
      handle: row.handle,
      title: row.title,
      descriptionHtml: row.descriptionHtml,
      priceRange: {
        minVariantPrice: {
          amount: row.minPriceAmount,
          currencyCode: row.minPriceCurrencyCode
        },
        maxVariantPrice: {
          amount: row.maxPriceAmount,
          currencyCode: row.maxPriceCurrencyCode
        }
      },
      minPrice: row.minPrice,
      featuredImage: {
        url: row.featuredImageUrl,
        altText: row.featuredImageAltText,
        width: row.featuredImageWidth,
        height: row.featuredImageHeight
      },
      images: [] as Image[],
      variants: [] as Variant[],
      collections: [] as Collection[]
    }));

    const productIds = formattedProducts.map(p => `'${p.id}'`).join(', ');

    const images: Image[] = await db.all(`SELECT * FROM images WHERE productId IN (${productIds})`);
    images.forEach((img: any) => {
      const product = formattedProducts.find(p => p.id === img.productId);
      if (product) {
        product.images.push({
          url: img.url,
          altText: img.altText,
          width: img.width,
          height: img.height
        });
      }
    });

    const variants: Variant[] = await db.all(`SELECT * FROM variants WHERE productId IN (${productIds})`);
    for (const varRow of variants) {
      const product = formattedProducts.find(p => p.id === varRow.productId);
      if (product) {
        const variant: Variant = {
          id: varRow.id,
          title: varRow.title,
          quantityAvailable: varRow.quantityAvailable,
          availableForSale: varRow.availableForSale,
          price: {
              amount: varRow.priceAmount,
              currencyCode: varRow.priceCurrencyCode
          },
          selectedOptions: [] as Option[]
        };
        product.variants.push(variant);

        const options: Option[] = await db.all(`SELECT * FROM options WHERE variantId = '${varRow.id}'`);
        options.forEach((opt: any) => {
          variant.selectedOptions.push({
            name: opt.name,
            value: opt.value
          });
        });
      }
    }

    const collections: Collection[] = await db.all(`SELECT * FROM collections WHERE productId IN (${productIds})`);
    collections.forEach((col: any) => {
      const product = formattedProducts.find(p => p.id === col.productId);
      if (product) {
        product.collections.push({
          handle: col.handle,
          title: col.title,
          descriptionHtml: col.descriptionHtml,
          updatedAt: col.updatedAt,
          id: col.id,
          image: col.image
        });
      }
    });

    res.json({ results: formattedProducts });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};
