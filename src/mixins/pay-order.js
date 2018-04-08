import qs from 'query-string';
import { wxRequest, transactionPost } from '@/apis';

export default {
  methods: {
    async payOrder(order) {
      const transaction = await this.postTransaction(order.id);
      console.info('transaction', transaction);
      wx.requestPayment({
        timeStamp: '',
        nonceStr: '',
        package: '',
        signType: 'MD5',
        paySign: '',
        success(res) {
          this.onPaymentSucess(res);
        },
        fail(res) {
          this.onPaymentFail(res);
        }
      });
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
