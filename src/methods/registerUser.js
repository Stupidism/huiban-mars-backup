import { wxRequest, userPost } from '@/apis';

export default async (credentials) => {
  try {
    const user = await wxRequest(userPost(credentials));
    if (user.type === 'Validation Error') {
      const error = new Error();
      error.data = user;
      throw error;
    }
    return user;
  } catch (e) {
    console.error('registerUser failed', e);
    throw e;
  }
};
