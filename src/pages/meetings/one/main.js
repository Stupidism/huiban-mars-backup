import Vue from 'vue';
import App from './meeting-detail';

const app = new Vue(App);
app.$mount();

export default {
  config: {
    navigationBarTitleText: '会议详情',
  },
};
