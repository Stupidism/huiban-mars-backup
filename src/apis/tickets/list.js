import _ from 'lodash';
import { example as meetings } from '../meetings/list';

export const example = [{
  id: 1,
  buyerId: 1,
  participantId: undefined,
  type: 'bought_ticket',
  typeDesc: '购票',
  status: 'no_participant',
  statusDesc: '未确认',
  meetingId: 1,
  meeting: {
    ...meetings[0],
    status: '报名中',
  },
  orderId: 1,
  price: 19000,
  gradeType: '早鸟票',
  gradeTypeColor: 'blue',
}, {
  id: 2,
  buyerId: 1,
  participantId: 2,
  participant: {
    name: '李小龙',
  },
  type: 'bought_ticket',
  typeDesc: '购票',
  status: 'has_participant',
  statusDesc: '已确认',
  meetingId: 1,
  meeting: {
    ...meetings[0],
    status: '报名中',
  },
  orderId: 1,
  price: 59000,
  gradeType: 'VIP票',
  gradeTypeColor: 'orange',
}, {
  id: 3,
  buyerId: 1,
  participantId: 1,
  participant: {
    name: '我',
  },
  type: 'gift_ticket',
  typeDesc: '赠票',
  status: 'has_participant',
  statusDesc: '已确认',
  meetingId: 1,
  meeting: {
    ...meetings[0],
    status: '报名中',
  },
  orderId: 1,
  price: 129000,
  gradeType: '贵宾票',
  gradeTypeColor: 'black',
}, {
  id: 4,
  buyerId: 2,
  buyer: {
    name: '李大龙',
    wechatAvatar: 'https://s1.ax1x.com/2018/05/10/C0tVz9.png',
  },
  participantId: 1,
  participant: {
    name: '我',
  },
  type: 'gift_ticket',
  typeDesc: '赠票',
  status: 'has_participant',
  statusDesc: '已确认',
  meetingId: 1,
  meeting: {
    ...meetings[0],
    status: '报名中',
  },
  orderId: 2,
  price: 129000,
  gradeType: '贵宾票',
  gradeTypeColor: 'black',
}];

export default (query = {}) => ({
  url: '/tickets',
  query: _.pick(query, ['meetingId', 'orderId', 'populate']),
});
