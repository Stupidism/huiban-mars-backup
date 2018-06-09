export default () => new Promise((resolve, reject) => {
  console.info('login to wechat start');
  wx.login({
    success: ({ code }) => {
      console.info('login to wechat success', code);
      resolve(code);
    },
    fail(error) {
      console.info('login to wechat fail');
      reject(error);
    },
  });
});
