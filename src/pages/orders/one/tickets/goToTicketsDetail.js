export default orderId => wx.navigateTo({
  url: `/pages/orders/one/tickets/main?orderId=${orderId}`,
});

