import Vue from 'vue';
import App from './new-order';

const app = new Vue(App);
app.$mount();

export default {
  config: {
    navigationBarTitleText: '订单确认及支付',
  },
};
