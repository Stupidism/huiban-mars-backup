import urlJoin from 'url-join';

const baseUrl = 'https://imeetingu.com/earth/';

export default ({
  url,
  ...options
}) =>
  new Promise((resolve, reject) => {
    wx.request({
      ...options,
      url: urlJoin(baseUrl, url),
      success(res) {
        if (res.statusCode >= 300) {
          reject(res);
          return;
        }
        if (typeof res.data === 'object') {
          resolve(res.data);
        } else {
          resolve(res);
        }
      },
      fail(error) {
        reject(error);
      },
    });
  });
