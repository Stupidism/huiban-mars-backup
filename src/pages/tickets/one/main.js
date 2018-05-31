import Vue from 'vue';
import App from './ticket-view';

const app = new Vue(App);
app.$mount();

export default {
  config: {
    navigationBarTitleText: '赠送他人',
  },
};
