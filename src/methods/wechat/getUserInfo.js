export default () => new Promise((resolve, reject) => {
  console.info('getWechatUserInfo start');
  wx.getUserInfo({
    success: (res) => {
      console.info('getWechatUserInfo success', res);
      resolve(res);
    },
    fail(error) {
      console.info('getWechatUserInfo fail', error);
      reject(error);
    },
  });
});
