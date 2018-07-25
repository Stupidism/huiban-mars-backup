import isEmail from '../isEmail';

const emailRegexValidator = (email) => {
  if (isEmail(email)) return '';
  return '邮箱格式有误';
};

export default emailRegexValidator;
