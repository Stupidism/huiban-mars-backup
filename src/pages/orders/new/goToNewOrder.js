import buildUrl from 'build-url';

export default queryParams => wx.navigateTo({
  url: buildUrl({
    path: '/pages/orders/new/main',
    queryParams,
  }),
});
