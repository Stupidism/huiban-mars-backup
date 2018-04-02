export default orderId => ({
  url: '/transactions',
  method: 'POST',
  data: JSON.stringify({
    orderId,
  }),
});
