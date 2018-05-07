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
    const transaction = await wxRequest(transactionPost(orderId));
    return transaction;
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

export default async function payTransactionForOrder(order) {
  let transaction = order.transaction;
  if (!transaction || (new Date(transaction.expiresAt) < new Date())) {
    transaction = await postTransaction(order.id);
  }

  payTransaction(transaction);
};
