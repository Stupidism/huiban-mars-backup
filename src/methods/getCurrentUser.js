import { wxRequest, userCurrentGet } from '@/apis';

import { login, loginToWechat, startAuthenticate, finishAuthenticate } from './auth';

const checkSession = () => new Promise((resolve, reject) => {
  console.info('checkSession start');
  wx.checkSession({
    success: () => {
      console.info('checkSession success');
      resolve();
    },
    fail: () => {
      console.info('checkSession fail');
      reject();
    },
  });
});


const getCurrentUser = async () => {
  try {
    await checkSession();

    const getCurrentUserPromise = wxRequest(userCurrentGet());
    startAuthenticate();

    const currentUser = await getCurrentUserPromise || {};

    finishAuthenticate();
    return currentUser;
  } catch (e) {
    console.error('getCurrentUser tolerate first failure', e);
  }
  console.info('getCurrentUser try to refresh token and fetch again');

  const wechatCode = await loginToWechat();
  await login({
    type: 'wechat',
    wechatCode,
  });
  finishAuthenticate();

  return wxRequest(userCurrentGet());
};

export default getCurrentUser;
