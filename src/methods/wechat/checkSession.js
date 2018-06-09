export default () => new Promise((resolve, reject) => {
  console.info('checkSession start');
  wx.checkSession({
    success: () => {
      console.info('checkSession success');
      resolve();
    },
    fail: (error) => {
      console.info('checkSession fail');
      reject(error);
    },
  });
});
