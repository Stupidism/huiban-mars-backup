import Vue from 'vue';
import App from './check-ticket';

const app = new Vue(App);
app.$mount();

export default {
  config: {
    navigationBarTitleText: '验票',
  },
};
