import { wxRequest, userPost } from '@/apis';

export default async (credentials) => {
  try {
    const user = await wxRequest(userPost(credentials));
    return user;
  } catch (e) {
    console.error('registerUser failed', e);
    return {
      name: 'fake_user',
      id: -1,
    };
  }
};
