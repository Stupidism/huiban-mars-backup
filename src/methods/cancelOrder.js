import { wxRequest, orderPut } from '@/apis';
import openModal from '@/utils/modal';

const cancelOrder = async (orderId) => {
  try {
    const newOrder = await wxRequest(orderPut(orderId, { status: 'cancelled' }));
    return newOrder;
  } catch (e) {
    console.error(e.statusCode, e.data);
  }

  try {
    await openModal({
      title: '取消订单失败',
      content: '请尝试再次取消或联系客服!',
      cancelText: '知道了',
      confirmText: '再次取消',
    });
  } catch (e) {
    return null;
  }

  return cancelOrder(orderId);
};

const confirmAndCancelOrder = async (orderId) => {
  try {
    await openModal({
      title: '取消订单',
      content: '确定取消吗?',
      cancelText: '不取消',
      confirmText: '确认取消',
    });
  } catch (e) {
    return null;
  }

  return cancelOrder(orderId);
};

export default confirmAndCancelOrder;
