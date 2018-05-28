export default ({ phone, smsCode, encryptedData, iv, ...rest }) => {
  const userBody = rest.type === 'smsCode' ? {
    phone,
    smsCode,
  } : {
    encryptedData,
    iv,
  };

  return {
    method: 'POST',
    url: '/users',
    data: JSON.stringify({
      ...rest,
      ...userBody,
    }),
  };
};
