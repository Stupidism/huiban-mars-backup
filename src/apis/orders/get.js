import { example as meeting } from '../meetings/get';
import { example as paymentMethods } from '../payment_methods/list';

export const example = {
  id: 1,
  status: 'completed',
  statusDesc: '已完成',
  userPhone: '15180003727',
  userName: '李逍遥',
  meeting,
  items: [{
    id: 0,
    meetingId: 1,
    ticketPrice: 19000,
    ticketAmount: 4,
    ticketGradeId: 1,
    ticketGradeType: '早鸟票',
  }],
  payedAt: new Date(),
  createdAt: new Date(),
  finishedAt: new Date(),
  cancelledAt: new Date(),
  transaction: {
    id: '123',
    thirdPartyTransactionId: '123',
    createdAt: new Date(),
    expiresAt: new Date(),
  },
  paymentMethod: paymentMethods[0],
  duePayment: 76000,
  actualPayment: 0,
};

export default id => ({
  url: `/orders/${id}`,
});
