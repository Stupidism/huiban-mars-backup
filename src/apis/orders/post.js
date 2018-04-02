export default order => ({
  url: '/orders',
  method: 'POST',
  data: JSON.stringify(order),
});
