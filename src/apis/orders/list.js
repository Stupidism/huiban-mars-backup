import { example as order } from './get';

export const example = [
  order,
  {
    ...order,
    id: 2,
    status: 'to_be_paid',
    statusDesc: '待支付',
  },
  {
    ...order,
    id: 3,
    status: 'cancelled',
    statusDesc: '已取消',
  },
  {
    ...order,
    id: 4,
    status: 'closed',
    statusDesc: '已关闭',
  },
];

export default () => ({
  url: '/orders?populate=meeting,paymentMethod,transaction',
});

