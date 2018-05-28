export default userBody => ({
  method: 'PUT',
  url: `/users/${userBody.id}`,
  data: JSON.stringify(userBody),
});
