// Copied from https://blog.csdn.net/voidmain_123/article/details/78962164

const phoneRegex = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;

export default phone => phoneRegex.test(String(phone));
