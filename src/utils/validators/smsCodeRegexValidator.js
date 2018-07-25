import isSmsCode from '../isSmsCode';

const smsCodeRegexValidator = (smsCode) => {
  if (isSmsCode(smsCode)) return '';
  return '验证码格式有误';
};

export default smsCodeRegexValidator;
