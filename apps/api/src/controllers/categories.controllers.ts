import { Request, Response } from 'express';
import openDb from '../db/db';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const db = await openDb();

    const categories = await db.all(`SELECT * FROM categories`);

    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
  res.end()
};
