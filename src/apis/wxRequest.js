import urlJoin from 'url-join';

const baseUrl = 'https://imeetingu.com/earth/';

const defaultOptions = {};

const wxRequest = ({
  url,
  ...options
}) => {
  const { header, getAuthHeader } = { ...defaultOptions, ...options };
  const headerWithAuthInfo = getAuthHeader ? {
    ...header,
    ...getAuthHeader(),
  } : header;

  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      url: urlJoin(baseUrl, url),
      header: headerWithAuthInfo,
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
};


wxRequest.setOptions = defaults => Object.assign(defaultOptions, defaults);

export default wxRequest;
