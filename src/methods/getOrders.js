import { wxRequest, orderList } from '@/apis';

export default async () => {
  try {
    const orders = await wxRequest(orderList());
    return orders;
  } catch (e) {
    console.error(e.statusCode, e.data, e);
    throw e;
  }
};
