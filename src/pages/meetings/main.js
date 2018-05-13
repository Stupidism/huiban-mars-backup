import Vue from 'vue';
import App from './recent-meetings';

const app = new Vue(App);
app.$mount();

export default {
  config: {
    navigationBarTitleText: '会伴',
  },
};
