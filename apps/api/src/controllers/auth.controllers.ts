import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PlatformUser } from "@enterprise-commerce/core/platform/types"

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, displayName, firstName, lastName, phone, acceptsMarketing, tags } = req.body;
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

  // please finish this function

};