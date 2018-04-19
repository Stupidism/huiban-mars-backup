import qs from 'query-string';
import { wxRequest, transactionPost } from '@/apis';

const onPaymentSucess = (orderId) => {
  wx.navigateTo({
    url: `/pages/new-order/payment-result/main?${qs.stringify({
      order: orderId || 1,
    })}`,
  });
};

const onPaymentFail = error => console.error(error);

const postTransaction = async (orderId) => {
  try {
    return await wxRequest(transactionPost(orderId));
  } catch (e) {
    if (e.errMsg === 'request:fail url not in domain list') {
      return {};
    }
    console.error(e.statusCode, e.data);
    throw e;
  }
};

const payTransaction = (transaction) => {
  console.info('transaction', transaction);
  if (!transaction.thirdPartyTransactionInfo) {
    onPaymentSucess(1);
    return;
  }

  wx.requestPayment({
    ...transaction.thirdPartyTransactionInfo,
    success: (res) => {
      onPaymentSucess(res);
    },
    fail: (res) => {
      onPaymentFail(res);
    }
  });
};

export default {
  methods: {
    async payOrder(order) {
      if (!order.transaction || (new Date(order.transaction.expiresAt) < new Date())) {
        const transaction = await postTransaction(order.id);
        return payTransaction(transaction);
      }
      return payTransaction(order.transaction);
    },
  }
};
