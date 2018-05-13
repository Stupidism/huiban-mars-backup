import Vue from 'vue';
import App from './share-result';

const app = new Vue(App);
app.$mount();

export default {
  config: {
    navigationBarTitleText: '赠送结果',
  },
};
