import { buildUrl as buildTicketViewUrl } from '@/pages/tickets/one/goToTicketView';

export default ({ user, ticket, ...options }) => {
  const { id, meetingId, gradeType, gradeTypeColor } = ticket;

  return {
    title: `${user.name}送您一张${gradeType || '门票'}`,
    path: buildTicketViewUrl(id, { meetingId }),
    imageUrl: `/static/ticket/${gradeTypeColor || 'blue'}.png`,
    fail(error) {
      // 转发失败
      console.error('share failed', ticket, error);
    },
    ...options,
  };
};
