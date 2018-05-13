import qs from 'query-string';

export default ({ meetingId }) => wx.navigateTo({
  url: `/pages/orders/new/main?${qs.stringify({
    meetingId,
  })}`,
});
