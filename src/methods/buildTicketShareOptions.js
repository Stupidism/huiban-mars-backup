import buildUrl from './buildUrl';

export default ({ user, ticket, ...options }) => {
  const { id, meetingId, gradeType } = ticket;

  return {
    title: `${user.name}送您一张${gradeType || '门票'}`,
    path: buildUrl({
      reLaunch: true,
      nextType: 'view_or_acquire_ticket',
      path: '/pages/tickets/one/main',
      queryParams: {
        id,
        meetingId,
        buyerId: user.id,
      },
    }),
    imageUrl: ticket.shareCardCoverImg || '/static/default-share-card-cover.png',
    fail(error) {
      // 转发失败
      console.error('share failed', ticket, error);
    },
    ...options,
  };
};
