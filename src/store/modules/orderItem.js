import toCash from '@/utils/filters/cash';

export default {
  namespaced: true,
  state: {
    ticketGrade: {},
    amount: 0,
  },
  mutations: {
    setTicketGrade(state, ticketGrade) {
      state.ticketGrade = ticketGrade;
      if (ticketGrade) {
        state.amount = Math.min(state.amount || 1, ticketGrade.restAmount);
      }
    },
    setAmount(state, amount) {
      state.amount = amount;
    },
  },
  getters: {
    priceInCash(state) {
      return toCash(state.ticketGrade.price);
    },
    sumPrice(state) {
      if (!state.ticketGrade || !state.amount) return 0;
      return state.ticketGrade.price * state.amount;
    },
    sumPriceInCash(state, getters) {
      return toCash(getters.sumPrice);
    },
  },
};
