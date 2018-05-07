import { wxRequest, orderPost } from '@/apis';

export default async function postOrder(orderBody) {
  try {
    const newOrder = await wxRequest(orderPost(orderBody));
    return newOrder;
  } catch (e) {
    if (e.errMsg === 'request:fail url not in domain list') {
      return {};
    }
    console.error(e.statusCode, e.data);
    throw e;
  }
};
