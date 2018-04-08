import { example as meeting } from './get';

export const example = [
  meeting,
  {
    topic: '只是另一个会议',
    holdAt: new Date(),
    host: '另一家主办方',
    address: '另一个地址',
    coverImg: '',
    ticketGrades: [...meeting.ticketGrades],
  },
];

export default () => ({
  url: '/meetings',
});
