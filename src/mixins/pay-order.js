import qs from 'query-string';
import { wxRequest, transactionPost } from '@/apis';

export default {
  methods: {
    async payOrder(order) {
      if (!order.transaction || (new Date(order.transaction.expiresAt) < new Date())) {
        const transaction = await this.postTransaction(order.id);
        return this.payTransaction(transaction);
      }
      return this.payTransaction(order.transaction);
    },
    async postTransaction(orderId) {
      try {
        return await wxRequest(transactionPost(orderId));
      } catch (e) {
        if (e.errMsg === 'request:fail url not in domain list') {
          return {};
        }
        console.error(e.statusCode, e.data);
        throw e;
      }
    },
    payTransaction(transaction) {
      console.info('transaction', transaction);
      wx.requestPayment({
        ...transaction.thirdPartyTransactionInfo,
        success: (res) => {
          this.onPaymentSucess(res);
        },
        fail: (res) => {
          this.onPaymentFail(res);
        }
      });
    },
    onPaymentSucess(order) {
      wx.navigateTo({
        url: `./payment-result/main?${qs.stringify({
          order: order.id || 1,
        })}`,
      });
    },
    onPaymentFail(error) {
      console.error(error);
    },
  }
};
