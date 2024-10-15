import { PlatformAccessToken, PlatformUserCreateInput, PlatformUser } from '@enterprise-commerce/core/platform/types';
import axios from 'axios';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const registerUser = async (input: PlatformUserCreateInput): Promise<Pick<PlatformUser, "id"> | undefined | null> => {
  // ToDo: Implement the registerUser function
  return null
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  // ToDo: Implement the loginUser function
  const user = {id: null} // replace this line


  // The following lines can be left unchanged because the output is expected to be a JWT token and an expiresAt value
  const token = jwt.sign({ id: user?.id }, process.env.JWT_SECRET || "no_key_set" as string, { expiresIn: '1h' });
  const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString(); // 3600 seconds = 1 hour
  res.json({ token, expiresAt });
};

const getUser = async (accessToken: string): Promise<PlatformUser | undefined | null> => {
  try {
    if(accessToken != "") {
      const { data } = await axios.get('http://localhost:3001/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return data.user;
    } else {
      return null
    }
  } catch (error) {
    console.error(error);
    // Handle error
    return null;
  }
};

export default {
  registerUser,
  loginUser,
  getUser
};