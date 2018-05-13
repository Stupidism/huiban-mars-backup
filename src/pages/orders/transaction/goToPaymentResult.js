import qs from 'query-string';

export default orderId => wx.navigateTo({
  url: `/pages/orders/transaction/main?${qs.stringify({
    orderId: orderId || 1,
  })}`,
});
