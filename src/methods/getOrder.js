import { wxRequest, orderGet } from '@/apis';
import { example as orderExample } from '@/apis/orders/get';

export default async function getOrder(id) {
  try {
    const order = await wxRequest(orderGet(id));
    return order;
  } catch (e) {
    if (e.errMsg === 'request:fail url not in domain list') {
      return orderExample;
    }

    console.error(e.statusCode, e.data);
    throw e;
  }
};
