export default (id, body) => ({
  url: `/orders/${id}`,
  method: 'PUT',
  data: JSON.stringify(body),
});
