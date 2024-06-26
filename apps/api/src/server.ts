import express, { Request, Response } from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Database } from 'sqlite';
import openDb from './db/db';

const app = express();
const PORT = process.env.PORT || 3001;


app.get('/products', async (req: Request, res: Response) => {
  try {
    const db = await openDb();

    const products = await db.all(`SELECT * FROM products`);

    const formattedProducts = products.map((row: any) => ({
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
      images: [] as any[],
      variants: [] as any[],
      collections: [] as any[]
    }));

    const productIds = formattedProducts.map(p => p.id);
    const images = await db.all(`SELECT * FROM images WHERE productId IN (${productIds.map(id => `'${id}'`).join(', ')})`);
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

    const variants = await db.all(`SELECT * FROM variants WHERE productId IN (${productIds.map(id => `'${id}'`).join(', ')})`);
    for (const varRow of variants) {
      const product = formattedProducts.find(p => p.id === varRow.productId);
      if (product) {
        const variant = {
          id: varRow.id,
          title: varRow.title,
          quantityAvailable: varRow.quantityAvailable,
          availableForSale: varRow.availableForSale,
          price: {
            amount: varRow.priceAmount,
            currencyCode: varRow.priceCurrencyCode
          },
          selectedOptions: [] as any[]
        };
        product.variants.push(variant);

        const options = await db.all(`SELECT * FROM options WHERE variantId = '${varRow.id}'`);
        options.forEach((opt: any) => {
          variant.selectedOptions.push({
            name: opt.name,
            value: opt.value
          });
        });
      }
    }

    const collections = await db.all(`SELECT * FROM collections WHERE productId IN (${productIds.map(id => `'${id}'`).join(', ')})`);
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
  res.end()
});

app.get('/categories', async (req: Request, res: Response) => {
  try {
    const db = await openDb();

    const categories = await db.all(`SELECT * FROM categories`);

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
  res.end()
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
