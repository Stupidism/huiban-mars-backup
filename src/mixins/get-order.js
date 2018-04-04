import { wxRequest, orderGet } from '@/apis';
import { example as orderExample } from '@/apis/orders/get';

const statuses = ['to_be_paid', 'completed', 'cancelled', 'closed'];
const statusDescs = ['待支付', '已完成', '已取消', '已关闭'];

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

      const randomIndex = Math.floor(Math.random() * 2);
      this.order.status = statuses[randomIndex];
      this.order.statusDesc = statusDescs[randomIndex];
    },
  }
};
