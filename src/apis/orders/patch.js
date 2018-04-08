export default (id, body) => ({
  url: `/orders/${id}`,
  method: 'PATCH',
  data: JSON.stringify(body),
});
