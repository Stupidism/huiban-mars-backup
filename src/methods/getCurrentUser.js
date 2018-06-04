import _ from 'lodash';
import { wxRequest, userCurrentGet } from '@/apis';
import { example as userExample } from '@/apis/users/current';

import login, { loginToWechat } from './login';

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

const promptInternetError = () => wx.showModal({
  title: '网络异常',
  content: '无法登录',
  showCancel: false,
  success(res) {
    if (res.confirm) {
      console.info('user clicked confirm');
    }
  },
});

const getCurrentUser = async () => {
  try {
    await checkSession();
    const user = await wxRequest(userCurrentGet());
    if (_.isEmpty(user)) throw new Error('Empty User');
    return {
      ...user,
      id: 1,
    };
  } catch (e) {
    console.error('getCurrentUser fail at first attempt', e);
    if (e.errMsg !== 'request:fail url not in domain list' && e.statusCode !== 401) {
      promptInternetError();
      return {};
    }
  }

  console.error('getCurrentUser try to refresh token and fetch again');

  try {
    const wechatCode = await loginToWechat();
    await login({
      type: 'wechat',
      wechatCode,
    });
    const user = await wxRequest(userCurrentGet());
    return user;
  } catch (e) {
    console.error('getCurrentUser fail at second attempt', e);
    if (e.errMsg !== 'request:fail url not in domain list') {
      promptInternetError();
      return {};
    }
    return userExample;
  }
};

export default getCurrentUser;
