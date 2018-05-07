import { wxRequest, orderList } from '@/apis';
import { example as orderssExample } from '@/apis/orders/list';

export default async () => {
  try {
    const orders = await wxRequest(orderList());
    return orders;
  } catch (e) {
    if (e.errMsg === 'request:fail url not in domain list') {
      return orderssExample;
    }

    console.error(e.statusCode, e.data, e);
    throw e;
  }
};
