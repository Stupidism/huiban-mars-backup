import qs from 'query-string';

export const buildUrl = ({ meetingId, amount, ticketGradeId }) => `/pages/orders/new/main?${qs.stringify({
  meetingId,
  amount,
  ticketGradeId,
})}`;

export default options => wx.navigateTo({
  url: buildUrl(options),
});
