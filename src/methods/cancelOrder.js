import { wxRequest, orderPut } from '@/apis';

const cancelOrder = async (orderId) => {
  try {
    const newOrder = await wxRequest(orderPut(orderId, { status: 'cancelled' }));
    return newOrder;
  } catch (e) {
    console.error(e.statusCode, e.data);
    throw e;
  }
};

export default cancelOrder;
