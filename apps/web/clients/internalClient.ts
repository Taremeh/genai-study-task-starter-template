import { PlatformAccessToken, PlatformUserCreateInput, PlatformUser } from '@enterprise-commerce/core/platform/types';
import axios from 'axios';

const registerUser = async (input: PlatformUserCreateInput): Promise<Pick<PlatformUser, "id"> | undefined | null> => {
  // ToDo: Implement the registerUser function
  return null
};

// const loginUser = ...

const getUser = async (accessToken: string): Promise<PlatformUser | undefined | null> => {
  try {
    const { data } = await axios.get('http://localhost:3001/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return data.user;
  } catch (error) {
    console.error(error);
    // Handle error
    return null;
  }
};

export default {
  registerUser,
  // loginUser,
  getUser
};