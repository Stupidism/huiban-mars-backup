import qs from 'query-string';

export default orderId => wx.navigateTo({
  url: `/pages/new-order/payment-result/main?${qs.stringify({
    orderId: orderId || 1,
  })}`,
});
