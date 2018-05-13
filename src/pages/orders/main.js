import Vue from 'vue';
import App from './my-orders';

const app = new Vue(App);
app.$mount();

export default {
  config: {
    navigationBarTitleText: '我的订单',
  },
};
