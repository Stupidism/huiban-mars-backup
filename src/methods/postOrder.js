import { wxRequest, orderPost } from '@/apis';

export default async function postOrder(orderBody) {
  try {
    const newOrder = await wxRequest(orderPost(orderBody));
    newOrder.id = newOrder.id || 1;
    return newOrder;
  } catch (e) {
    console.error(e.statusCode, e.data);
    throw e;
  }
};
