import { wxRequest, tokensPost } from '@/apis';

const authState = {
  authenticating: false,
  authorizing: false,
};

export const getAccessToken = () => wx.getStorageSync('access_token');
export const setAccessToken = accessToken => wx.setStorageSync('access_token', accessToken);

export const startAuthenticate = () => {
  authState.authenticating = true;
};

export const finishAuthenticate = () => {
  authState.authenticating = false;
};

const isAuthing = () => authState.authenticating || authState.authorizing;

const buildAuthHeader = () => {
  const token = getAccessToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getAuthHeader = async () => new Promise((resolve) => {
  if (isAuthing()) {
    let times = 0;
    const interval = setInterval(() => {
      console.log('interval');
      times += 1;
      if (!isAuthing() || times > 20) {
        clearInterval(interval);
        resolve(buildAuthHeader());
      }
    }, 100);
  } else {
    resolve(buildAuthHeader());
  }
});

export const login = async ({ type, wechatCode }) => {
  console.info('login start');
  authState.authorizing = true;
  setAccessToken('');
  try {
    const result = await wxRequest(tokensPost({ type, wechatCode }));
    console.info('login succeed', result);
    setAccessToken(result.access_token);
  } catch (e) {
    console.error('login fail', e);
  }
  authState.authorizing = false;
};

export const loginToWechat = () => new Promise((resolve, reject) => {
  console.info('login to wechat start');
  wx.login({
    success: ({ code }) => {
      console.info('login to wechat success', code);
      resolve(code);
    },
    fail() {
      console.info('login to wechat fail');
      reject();
    },
  });
});
