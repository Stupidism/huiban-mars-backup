import { wxRequest, transactionPost } from '@/apis';
import goToPaymentResult from '@/pages/orders/transaction/goToPaymentResult';

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
    goToPaymentResult(1);
    return;
  }

  wx.requestPayment({
    ...transaction.thirdPartyTransactionInfo,
    success: () => {
      goToPaymentResult(transaction.orderId);
    },
    fail: (res) => {
      onPaymentFail(res);
    },
  });
};

export default async function payTransactionForOrder(order) {
  let transaction = order.transaction;
  if (!transaction || (new Date(transaction.expiresAt) < new Date())) {
    transaction = await postTransaction(order.id);
  }

  payTransaction(transaction);
};
