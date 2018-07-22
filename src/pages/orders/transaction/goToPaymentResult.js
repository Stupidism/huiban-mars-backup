import buildUrl from 'build-url';

export default orderId => wx.navigateTo({
  url: buildUrl({
    path: '/pages/orders/transaction/main',
    queryParams: {
      orderId,
    },
  }),
});
