import urlJoin from 'url-join';
import _ from 'lodash';
import qs from 'query-string';

const baseUrl = 'https://imeetingu.com/earth/';

const defaultOptions = {};

const wxRequest = ({
  url,
  query,
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
      url: urlJoin(baseUrl, url, _.isEmpty(query) ? '' : `?${qs.stringify(query)}`),
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
