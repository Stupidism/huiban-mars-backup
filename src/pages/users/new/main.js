import Vue from 'vue';
import App from './user-login-or-register';

const app = new Vue(App);
app.$mount();

export default {
  config: {
    navigationBarTitleText: '登录',
  },
};
