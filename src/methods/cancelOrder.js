import { wxRequest, orderPatch } from '@/apis';
import goToOrderDetail from '@/pages/orders/one/goToOrderDetail';

const cancelOrder = async (orderId) => {
  try {
    const newOrder = await wxRequest(orderPatch(orderId, { status: 'cancelled' }));
    wx.navigateBack({ delta: 1 });
    goToOrderDetail(newOrder.id || 1);
  } catch (e) {
    if (e.errMsg === 'request:fail url not in domain list' || e.statusCode === 405) {
      wx.navigateBack({ delta: 1 });
      goToOrderDetail(orderId);
      return;
    }

    console.error(e.statusCode, e.data);
    throw e;
  }
};

export default cancelOrder;
