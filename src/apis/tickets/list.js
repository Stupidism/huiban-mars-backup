import { example as meetings } from '../meetings/list';

export const example = [{
  buyerId: 1,
  participantId: undefined,
  type: 'bought_ticket',
  typeDesc: '购票',
  status: 'no_participant',
  statusDesc: '未确认',
  meeting: {
    ...meetings[0],
    status: '报名中',
  },
}, {
  buyerId: 1,
  participantId: 1,
  type: 'bought_ticket',
  typeDesc: '购票',
  status: '',
  statusDesc: '未确认',
  meeting: {
    ...meetings[0],
    status: '报名中',
  },
}];

export default () => ({
  url: '/tickets',
});
