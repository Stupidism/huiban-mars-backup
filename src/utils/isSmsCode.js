const smsCodeRegex = /^\d{6}$/;

export default smsCode => smsCodeRegex.test(String(smsCode));
