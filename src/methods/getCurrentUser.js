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

    finishAuthenticate();

    return res.statusCode === 204 ? {} : res;
  } catch (e) {
    if (e.errMsg === 'checkSession:fail Error: session time out, need relogin'
      || e.statusCode === 404) {
      console.error('getCurrentUser tolerate first failure', e);
    } else {
      throw e;
    }
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
