import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import bcrypt from 'bcryptjs';
import { PlatformUser } from "@enterprise-commerce/core/platform/types"
import openDb from '../db/db';

export const findUserByEmail = async (email: string): Promise<PlatformUser | null> => {
  try {
    const db = await openDb();
    const user = await db.get<PlatformUser>('SELECT * FROM users WHERE email = ?', email);
    await db.close();
    return user || null;
  } catch (error) {
    console.error("registerUserError");
    console.error(error);
  }
};

export const findUserById = async (id: string): Promise<PlatformUser | null> => {
  const db = await openDb();
  const user = await db.get<PlatformUser>('SELECT * FROM users WHERE id = ?', id);
  await db.close();
  return user || null;
};

export const createUser = async (user: PlatformUser, password: string): Promise<PlatformUser> => {
  try { 
    const db = await openDb();
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(user)
    await db.run(
      `INSERT INTO users (acceptsMarketing, createdAt, updatedAt, displayName, email, firstName, lastName, phone, tags, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      user.acceptsMarketing, user.createdAt, user.updatedAt, user.displayName, user.email, user.firstName, user.lastName, user.phone, JSON.stringify(user.tags), hashedPassword
    );
    
    await db.close();
    return user;
  } catch (error) {
    console.error("registerUserError");
    console.error(error);
  }
};

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
