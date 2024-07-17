import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, comparePasswords } from '../models/User';
import { PlatformUser } from "@enterprise-commerce/core/platform/types"

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, displayName, firstName, lastName, phone, acceptsMarketing, tags } = req.body;

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const newUser: PlatformUser = {
      id: null,
      acceptsMarketing,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      displayName,
      email,
      firstName,
      lastName,
      phone,
      tags,
    };

    const user = await createUser(newUser, password);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  
  try {
    const user = await findUserByEmail(email);
    
    if (!user || !(await comparePasswords(password, user.password))) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "no_key_set" as string, {
      expiresIn: '1h',
    });

    // Calculate the expiration timestamp
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString(); // 3600 seconds = 1 hour

    res.json({ token, expiresAt });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
