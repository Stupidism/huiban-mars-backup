import buildUrl from 'build-url';

export default (id, options) => wx.navigateTo({
  url: buildUrl({
    path: '/pages/tickets/one/main',
    queryParams: {
      id,
      ...options,
    },
  }),
});
