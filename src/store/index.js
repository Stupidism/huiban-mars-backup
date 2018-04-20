import Vue from 'vue';
import Vuex from 'vuex';

import orderItem from './modules/orderItem';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    userInfo: undefined,
    currentUser: undefined,
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    setCurrentUser(state, currentUser) {
      state.currentUser = currentUser;
    },
  },
  getters: {
    protectedCurrentUserPhone(state) {
      if (!state.currentUser) return '';
      const phone = state.currentUser.phone;
      if (!phone) return '';
      return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
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
