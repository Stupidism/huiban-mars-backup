import Vue from 'vue';
import App from './my-tickets';

const app = new Vue(App);
app.$mount();

export default {
  config: {
    navigationBarTitleText: '我的门票',
  },
};
