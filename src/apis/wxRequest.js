import urlJoin from 'url-join';
import _ from 'lodash';
import qs from 'query-string';

const baseUrl = 'https://imeetingu.com/earth/';

const defaultOptions = {};

const wxRequest = async ({
  url,
  query,
  disableAuth,
  ...options
}) => {
  const { getAuthHeader, ...mergedOptions } = { ...defaultOptions, ...options };

  if (getAuthHeader && !disableAuth) {
    const authHeader = await getAuthHeader();
    mergedOptions.header = {
      ...options.header,
      ...authHeader,
    };
  }

  return new Promise((resolve, reject) => {
    wx.request({
      ...mergedOptions,
      url: urlJoin(baseUrl, url, _.isEmpty(query) ? '' : `?${qs.stringify(query)}`),
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
