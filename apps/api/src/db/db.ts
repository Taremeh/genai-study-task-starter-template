import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Database } from 'sqlite';
import path from 'path';

export default async function openDb(): Promise<Database> {
  const filePath = path.join(__dirname, 'products.db');

  return open({
    filename: filePath,
    driver: sqlite3.Database
  });
}
