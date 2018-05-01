import Vue from 'vue';
import Vuex from 'vuex';

import orderItem from './modules/orderItem';
import runtime from './modules/runtime';

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    wechatUserInfo: undefined,
    currentUser: undefined,
  },
  mutations: {
    setWechatUserInfo(state, wechatUserInfo) {
      state.wechatUserInfo = wechatUserInfo;
    },
    setCurrentUser(state, currentUser) {
      state.currentUser = currentUser;
    },
  },
  getters: {
    currentUser({ currentUser = {}, wechatUserInfo }) {
      if (!wechatUserInfo) return currentUser;
      return {
        ...currentUser,
        name: currentUser.name || wechatUserInfo.nickName,
        wechatAvatar: wechatUserInfo.avatarUrl,
        wechatName: wechatUserInfo.nickName,
      };
    },
    protectedCurrentUserPhone(state) {
      if (!state.currentUser) return '';
      const phone = state.currentUser.phone;
      if (!phone) return '';
      return `${phone.slice(0, 3)}****${phone.slice(-4)}`;
    },
  },
  modules: {
    orderItem,
    runtime,
  },
});
Vue.use({
  install(vue) {
    vue.prototype.$store = store;
  },
});

export default store;
