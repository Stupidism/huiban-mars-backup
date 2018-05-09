import qs from 'query-string';

export default ({ meetingId }) => wx.navigateTo({
  url: `/pages/new-order/main?${qs.stringify({
    meetingId,
  })}`,
});
