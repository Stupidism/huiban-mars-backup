import { example as meeting } from './get';

export const example = [
  meeting,
  {
    id: 2,
    topic: '只是另一个会议',
    holdAt: new Date(),
    host: '另一家主办方',
    place: '另一个地址',
    coverImg: meeting.coverImg,
    ticketGrades: [...meeting.ticketGrades],
  },
];

export default () => ({
  url: '/meetings',
});
