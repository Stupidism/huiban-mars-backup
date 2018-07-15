import qs from 'query-string';

export const buildUrl = (id, options) => `/pages/tickets/one/main?${qs.stringify({
  id,
  ...options,
})}`;

export default (id, options) => wx.navigateTo({
  url: buildUrl(id, options),
});
