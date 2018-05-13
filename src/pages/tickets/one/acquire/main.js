import Vue from 'vue';
import App from './acquire-ticket';

const app = new Vue(App);
app.$mount();

export default {
  config: {
    navigationBarTitleText: '门票领取',
  },
};
