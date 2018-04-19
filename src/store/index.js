import Vue from 'vue';
import Vuex from 'vuex';

import orderItem from './modules/orderItem';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    userInfo: undefined,
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
  },
  modules: {
    orderItem,
  },
});
Vue.use({
  install(vue) {
    vue.prototype.$store = store;
  },
});

export default store;
