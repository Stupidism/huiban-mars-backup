import _ from 'lodash';
import { wxRequest, userCurrentGet } from '@/apis';

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

const getCurrentUser = async () => {
  try {
    await checkSession();
    const user = await wxRequest(userCurrentGet());
    if (_.isEmpty(user)) throw new Error('Empty User');
    return user;
  } catch (e) {
    const wechatCode = await loginToWechat();
    await login({
      type: 'wechat',
      wechatCode,
    });
    console.info('TODO: use real accessToken instead');
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
