import { PlatformAccessToken, PlatformUserCreateInput, PlatformUser } from '@enterprise-commerce/core/platform/types';
import axios from 'axios';

const registerUser = async (input: PlatformUserCreateInput): Promise<Pick<PlatformUser, "id"> | undefined | null> => {
  try {
    const { data } = await axios.post('http://localhost:3001/register', input);
    // Handle successful registration

    return data.user;
  } catch (error) {
    console.error(error);
    // Handle registration error
    return null;
  }
};

const loginUser = async (input: Pick<PlatformUserCreateInput, "password" | "email">): Promise<PlatformAccessToken | undefined | null> => {
  try {
    const { data } = await axios.post('http://localhost:3001/login', input);

    return {
      accessToken: data.token,
      expiresAt: data.expiresAt
    }
  } catch (error) {
    console.error(error);
    // Handle login error
  }
};

const getUser = async (accessToken: string): Promise<PlatformUser | undefined | null> => {
  try {
    if (accessToken != "") {
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
  loginUser,
  registerUser,
  getUser
};