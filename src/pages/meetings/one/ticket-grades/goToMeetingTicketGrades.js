export default (meetingId, method = 'navigateTo') => wx[method]({
  url: `/pages/meetings/one/ticket-grades/main?meetingId=${meetingId}`,
});

