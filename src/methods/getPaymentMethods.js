import { wxRequest, paymentMethodList } from '@/apis';
import { example as paymentMethodsExample } from '@/apis/payment_methods/list';

export default async function getPaymentMethods() {
  try {
    const paymentMethods = await wxRequest(paymentMethodList());
    return paymentMethods;
  } catch (e) {
    if (e.errMsg === 'request:fail url not in domain list' || e.statusCode === 404) {
      return paymentMethodsExample;
    }

    console.error(e.statusCode, e.data);
    throw e;
  }
};
