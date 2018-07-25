import isPhone from '../isPhone';

const phoneRegexValidator = (phone) => {
  if (isPhone(phone)) return '';
  return '手机号格式有误';
};

export default phoneRegexValidator;
