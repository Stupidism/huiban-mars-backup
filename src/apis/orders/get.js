export const example = {
  id: 1,
  status: 'completed',
  statusDesc: '已完成',
  userPhone: '13912345678',
  userName: 'xxx',
  items: [{
    id: 0,
    meetingId: 1,
    ticketPrice: 19000,
    ticketAmount: 4,
    ticketGradeId: 1,
  }],
};

export default id => ({
  url: `/orders/${id}`,
});
