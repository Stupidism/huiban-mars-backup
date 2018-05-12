export default {
  namespaced: true,
  state: {
    sharedTicket: {},
  },
  mutations: {
    setRuntime(runtime, newRuntime) {
      Object.assign(runtime, newRuntime);
    },
  },
};

