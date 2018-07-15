import { wxRequest, userCurrentGet } from '@/apis';

import { login, startAuthenticate, finishAuthenticate } from './auth';
import checkSession from './wechat/checkSession';
import wechatLogin from './wechat/login';

const getCurrentUser = async () => {
  try {
    await checkSession();

    const getCurrentUserPromise = wxRequest(userCurrentGet());
    startAuthenticate();

    const res = await getCurrentUserPromise;

    if (res.statusCode === 204) {
      throw new Error('new user');
    }

    finishAuthenticate();
    return res;
  } catch (e) {
    console.error('getCurrentUser tolerate first failure', e);
  }
  console.info('getCurrentUser try to refresh token and fetch again');

  const wechatCode = await wechatLogin();
  await login({
    type: 'wechat',
    wechatCode,
  });
  finishAuthenticate();

  return wxRequest(userCurrentGet());
};

export default getCurrentUser;
