import { wxRequest, paymentMethodList } from '@/apis';

export default async function getPaymentMethods() {
  try {
    const paymentMethods = await wxRequest(paymentMethodList());
    return paymentMethods;
  } catch (e) {
    console.error(e.statusCode, e.data);
    throw e;
  }
};
