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

export const isAuthing = () => authState.authenticating || authState.authorizing;

export const waitForAuth = () => new Promise((resolve) => {
  if (isAuthing()) {
    let times = 0;
    const interval = setInterval(() => {
      times += 1;
      if (!isAuthing() || times > 20) {
        clearInterval(interval);
        resolve();
      }
    }, 100);
  } else {
    resolve();
  }
});

const buildAuthHeader = () => {
  const token = getAccessToken();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getAuthHeader = async () => {
  if (isAuthing()) {
    await waitForAuth();
  }
  return buildAuthHeader();
};

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
