import _ from 'lodash';
import { wxRequest, userCurrentGet, tokensPost } from '@/apis';

const setAccessToken = accessToken => wx.setStorageSync('access_token', accessToken);

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

const loginToWechat = () => new Promise((resolve, reject) => {
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

const getCurrentUser = async () => {
  try {
    await checkSession();
    const user = await wxRequest(userCurrentGet());
    if (_.isEmpty(user)) throw new Error('Empty User');
    return user;
  } catch (e) {
    const wechatCode = await loginToWechat();
    const {
      access_token: accessToken,
    } = await wxRequest(tokensPost({ wechatCode }));

    console.info('TODO: use real accessToken instead');

    setAccessToken(accessToken);
  }

  try {
    const user = await wxRequest(userCurrentGet());
    return user;
  } catch (e) {
    wx.showModal({
      title: '网络异常',
      content: '无法登录',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          console.info('user clicked confirm');
        }
      },
    });
    return {};
  }
};

export default getCurrentUser;
