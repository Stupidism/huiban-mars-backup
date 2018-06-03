import Vue from 'vue';

import App from './App';
import './styles/weui.css';
import './styles/theme.less';

Vue.config.productionTip = false;
App.mpType = 'app';

const app = new Vue(App);
app.$mount();

export default {
  // 这个字段走 app.json
  config: {
    pages: [
      'pages/users/me/main',
      'pages/users/new/main',
      'pages/meetings/main',
      'pages/meetings/one/ticket-grades/main',
      'pages/meetings/one/tickets/main',
      'pages/orders/main',
      'pages/orders/new/main',
      'pages/orders/one/main',
      'pages/orders/transaction/main',
      'pages/tickets/main',
      '^pages/tickets/one/main',
      'pages/tickets/one/acquire/main',
      'pages/tickets/one/check/main',
      'pages/tickets/share-result/main',
    ], // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '会伴',
      navigationBarTextStyle: 'black',
    },
    tabBar: {
      selectedColor: '#2692F0',
      list: [{
        pagePath: 'pages/meetings/main',
        text: '近期会议',
        iconPath: 'static/tabbar/meetings.png',
        selectedIconPath: '/static/tabbar/meetings-checked.png',
      }, {
        pagePath: 'pages/users/me/main',
        text: '个人中心',
        iconPath: '/static/tabbar/personal-center.png',
        selectedIconPath: '/static/tabbar/personal-center-checked.png',
      }],
    },
  },
};
