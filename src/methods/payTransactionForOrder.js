import { wxRequest, transactionPost } from '@/apis';
import goToPaymentResult from '@/pages/orders/transaction/goToPaymentResult';

const promptPaymentError = options => new Promise(resolve => wx.showModal({
  title: '支付失败, 原因:',
  content: '交易错误!',
  cancelText: '查看支付结果',
  confirmText: '重新支付',
  cancelColor: '#000000',
  confirmColor: '#2692F0',
  ...options,
  complete: resolve,
}));

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

export const payTransaction = wechatTransaction =>
  new Promise(resolve => wx.requestPayment({
    ...wechatTransaction,
    complete: resolve,
  }));

export default async function payTransactionForOrder(order) {
  let transaction = order.transaction;
  if (!transaction || (new Date(transaction.expiresAt) < new Date())) {
    try {
      transaction = await postTransaction(order.id);
    } catch (e) {
      promptPaymentError({
        title: '交易创建失败',
        success: (res) => {
          if (res.confirm) {
            this.onSubmit();
          } else {
            goToPaymentResult(this.order.id);
          }
        },
      });
    }
  }

  const result = await payTransaction(transaction.thirdPartyTransactionInfo);

  if (result.errMsg === 'requestPayment:ok') {
    goToPaymentResult(order.id);
  } else {
    const detailMessage = result.errMsg.replace('requestPayment:fail ', '');
    if (detailMessage === 'cancel') {
      const res = await promptPaymentError({
        title: '取消支付',
        content: '确定要取消吗?',
        confirmText: '继续支付',
        cancelText: '确定取消',
      });

      if (res.confirm) {
        await payTransactionForOrder(order);
      }
    } else {
      const res = await promptPaymentError({
        content: detailMessage,
      });

      if (res.confirm) {
        await payTransactionForOrder(order);
      } else {
        goToPaymentResult(order.id);
      }
    }
  }

  return transaction;
};
