import { wxRequest, orderGet } from '@/apis';
import { example as orderExample } from '@/apis/orders/get';

export default {
  methods: {
    async getOrder(id) {
      try {
        this.order = orderExample;
        const res = await wxRequest(orderGet(id));
        this.order = res.order || res;
      } catch (e) {
        if (e.errMsg === 'request:fail url not in domain list') {
          this.order = orderExample;
        } else {
          console.error(e.statusCode, e.data);
          throw e;
        }
      }
    },
  }
};
