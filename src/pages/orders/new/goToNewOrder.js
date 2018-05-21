import qs from 'query-string';

export default ({ meetingId, amount, ticketGradeId }) => wx.navigateTo({
  url: `/pages/orders/new/main?${qs.stringify({
    meetingId,
    amount,
    ticketGradeId,
  })}`,
});
