import { wxRequest, tokensPost } from '@/apis';
import { setAccessToken } from './auth';

const login = async ({ type, wechatCode }) => {
  const result = await wxRequest(tokensPost({ type, wechatCode }));
  setAccessToken(result.access_token || '111');
};

export const loginToWechat = () => new Promise((resolve, reject) => {
  console.info('login start');
  wx.login({
    success: ({ code }) => {
      console.info('login success', code);
      resolve(code);
    },
    fail() {
      console.info('login fail');
      reject();
    },
  });
});

export default login;
