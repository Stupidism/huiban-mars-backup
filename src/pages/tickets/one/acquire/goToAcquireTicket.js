export default (id, meetingId) => wx.navigateTo({
  url: `/pages/tickets/one/acquire/main?id=${id}&meetingId=${meetingId}`,
});
