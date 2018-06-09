export default phone => ({
  url: '/sms_codes',
  method: 'POST',
  data: JSON.stringify({ phone }),
  disableAuth: true,
});
