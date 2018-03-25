import urlJoin from 'url-join';

const baseUrl = 'http://182.254.153.190:8080/earth';

export default ({
  url,
  responseAdaptor = data => data,
  ...options
}) =>
  new Promise((resolve, reject) => {
    wx.request({
      ...options,
      url: urlJoin(baseUrl, url),
      async success(res) {
        if (typeof res.data === 'object') {
          resolve(responseAdaptor(res.data));
        } else {
          resolve(responseAdaptor(res));
        }
      },
      fail(error) {
        reject(error);
      },
    });
  });
