export const example = [{
  type: 'wechat',
  typeDesc: '微信',
  desc: '推荐已安装微信的用户使用',
  iconImg: '/static/icons/wechat.png',
  thirdPartyPayeeId: 'xxxxxxx',
}];

export default () => ({
  url: '/payment_methods',
});