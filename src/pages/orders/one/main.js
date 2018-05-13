import Vue from 'vue';
import App from './order-detail';

const app = new Vue(App);
app.$mount();

export default {
  config: {
    navigationBarTitleText: '订单详情',
  },
};
