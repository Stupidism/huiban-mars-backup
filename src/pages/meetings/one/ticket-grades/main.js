import Vue from 'vue';
import App from './select-ticket-grade';

const app = new Vue(App);
app.$mount();

export default {
  config: {
    navigationBarTitleText: '选择票档',
  },
};
