import Vue from 'vue';
import Vuex from 'vuex';

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
});
Vue.use({
  install(vue) {
    vue.prototype.$store = store;
  },
});

export default store;
