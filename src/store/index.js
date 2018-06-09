import Vue from 'vue';
import Vuex from 'vuex';

import runtime from './modules/runtime';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    currentUser: {},
  },
  mutations: {
    setCurrentUser(state, currentUser) {
      state.currentUser = currentUser;
    },
  },
  getters: {
    currentUser({ currentUser }) {
      return currentUser;
    },
    protectedCurrentUserPhone(state) {
      if (!state.currentUser) return '';
      const phone = state.currentUser.phone;
      if (!phone) return '';
      return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
    },
  },
  modules: {
    runtime,
  },
});
Vue.use({
  install(vue) {
    vue.prototype.$store = store;
  },
});

export default store;
