import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Database } from 'sqlite';
import { readFileSync } from 'fs';
import path from 'path';
import openDb from './db';
import { Product } from '../types/product.types';

async function initializeDb(force: boolean = false) {
  try {
    const db = await openDb();

    const tableCheckQueries = [
      `SELECT name FROM sqlite_master WHERE type='table' AND name='products'`,
      `SELECT name FROM sqlite_master WHERE type='table' AND name='images'`,
      `SELECT name FROM sqlite_master WHERE type='table' AND name='variants'`,
      `SELECT name FROM sqlite_master WHERE type='table' AND name='options'`,
      `SELECT name FROM sqlite_master WHERE type='table' AND name='collections'`,
      `SELECT name FROM sqlite_master WHERE type='table' AND name='categories'`
    ];

    const tableChecks = await Promise.all(tableCheckQueries.map(query => db.get(query)));

    const tablesExist = tableChecks.every(check => check !== undefined);

    if (tablesExist && !force) {
      console.log('Database already initialized or init in progress.');
      await db.close();
      return;
    }

    await db.exec(`DROP TABLE IF EXISTS products`);
    await db.exec(`DROP TABLE IF EXISTS images`);
    await db.exec(`DROP TABLE IF EXISTS variants`);
    await db.exec(`DROP TABLE IF EXISTS options`);
    await db.exec(`DROP TABLE IF EXISTS collections`);
    await db.exec(`DROP TABLE IF EXISTS categories`);

    await db.exec(`CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      handle TEXT,
      title TEXT,
      descriptionHtml TEXT,
      minPriceAmount TEXT,
      minPriceCurrencyCode TEXT,
      maxPriceAmount TEXT,
      maxPriceCurrencyCode TEXT,
      minPrice REAL,
      featuredImageUrl TEXT,
      featuredImageAltText TEXT,
      featuredImageWidth INTEGER,
      featuredImageHeight INTEGER
    )`);

    await db.exec(`CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId TEXT,
      url TEXT,
      altText TEXT,
      width INTEGER,
      height INTEGER,
      FOREIGN KEY(productId) REFERENCES products(id)
    )`);

    await db.exec(`CREATE TABLE IF NOT EXISTS variants (
      id TEXT PRIMARY KEY,
      productId TEXT,
      title TEXT,
      quantityAvailable INTEGER,
      availableForSale BOOLEAN,
      priceAmount TEXT,
      priceCurrencyCode TEXT,
      FOREIGN KEY(productId) REFERENCES products(id)
    )`);

    await db.exec(`CREATE TABLE IF NOT EXISTS options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      variantId TEXT,
      name TEXT,
      value TEXT,
      FOREIGN KEY(variantId) REFERENCES variants(id)
    )`);

    await db.exec(`CREATE TABLE IF NOT EXISTS collections (
      id TEXT PRIMARY KEY,
      handle TEXT,
      title TEXT,
      descriptionHtml TEXT,
      updatedAt TEXT,
      image TEXT,
      productId TEXT,
      FOREIGN KEY(productId) REFERENCES products(id)
    )`);

    await db.exec(`CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      handle TEXT,
      title TEXT,
      descriptionHtml TEXT,
      seoDescription TEXT,
      seoTitle TEXT,
      image TEXT,
      updatedAt TEXT,
      description TEXT
    )`);
    
    const filePath = path.join(__dirname, '../demo/demo-data.json');
    const products: Product[] = JSON.parse(readFileSync(filePath, 'utf-8'));

    const categoriesFilePath = path.join(__dirname, '../demo/demo-categories-data.json');
    const categories = JSON.parse(readFileSync(categoriesFilePath, 'utf-8'));

    const insertProduct = await db.prepare(`INSERT OR IGNORE INTO products (id, handle, title, descriptionHtml, minPriceAmount, minPriceCurrencyCode, maxPriceAmount, maxPriceCurrencyCode, minPrice, featuredImageUrl, featuredImageAltText, featuredImageWidth, featuredImageHeight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    const insertImage = await db.prepare(`INSERT OR IGNORE INTO images (productId, url, altText, width, height) VALUES (?, ?, ?, ?, ?)`);
    const insertVariant = await db.prepare(`INSERT OR IGNORE INTO variants (id, productId, title, quantityAvailable, availableForSale, priceAmount, priceCurrencyCode) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    const insertOption = await db.prepare(`INSERT OR IGNORE INTO options (variantId, name, value) VALUES (?, ?, ?)`);

    const insertCollection = await db.prepare(`INSERT OR IGNORE INTO collections (id, handle, title, descriptionHtml, updatedAt, image, productId) VALUES (?, ?, ?, ?, ?, ?, ?)`);
    const insertCategory = await db.prepare(`INSERT OR IGNORE INTO categories (id, handle, title, descriptionHtml, seoDescription, seoTitle, image, updatedAt, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    for (const product of products) {
      await insertProduct.run(
        product.id,
        product.handle,
        product.title,
        product.descriptionHtml || '',
        product.priceRange.minVariantPrice.amount,
        product.priceRange.minVariantPrice.currencyCode,
        product.priceRange.maxVariantPrice.amount,
        product.priceRange.maxVariantPrice.currencyCode,
        product.minPrice,
        product.featuredImage.url,
        product.featuredImage.altText,
        product.featuredImage.width,
        product.featuredImage.height
      );

      for (const image of product.images) {
        await insertImage.run(product.id, image.url, image.altText, image.width, image.height);
      }

      for (const variant of product.variants) {
        await insertVariant.run(variant.id, product.id, variant.title, variant.quantityAvailable, variant.availableForSale, variant.price.amount, variant.price.currencyCode);

        for (const option of variant.selectedOptions) {
          await insertOption.run(variant.id, option.name, option.value);
        }
      }

      for (const collection of product.collections) {
        await insertCollection.run(collection.id, collection.handle, collection.title, collection.descriptionHtml, collection.updatedAt, collection.image, product.id);
      }
    }

    for (const category of categories) {
      await insertCategory.run(
        category.id,
        category.handle,
        category.title,
        category.descriptionHtml,
        category.seo?.description || null,
        category.seo?.title || null,
        category.image,
        category.updatedAt,
        category.description
      );
    }

    await insertProduct.finalize();
    await insertImage.finalize();
    await insertVariant.finalize();
    await insertOption.finalize();
    await insertCollection.finalize();
    await insertCategory.finalize();

    await db.close();
    console.log('Database initialized successfully.');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

initializeDb().catch(err => console.error(err));

export default initializeDb;
