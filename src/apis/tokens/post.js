export default credentials => ({
  url: '/tokens',
  method: 'POST',
  data: JSON.stringify(credentials),
});
