import { wxRequest, orderGet } from '@/apis';

export default async function getOrder(id) {
  try {
    const order = await wxRequest(orderGet(id));
    return order;
  } catch (e) {
    console.error(e.statusCode, e.data);
    throw e;
  }
};
