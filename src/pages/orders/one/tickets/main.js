import Vue from 'vue';
import App from './tickets-detail';

const app = new Vue(App);
app.$mount();

export default {
  config: {
    navigationBarTitleText: '门票详情',
  },
};
