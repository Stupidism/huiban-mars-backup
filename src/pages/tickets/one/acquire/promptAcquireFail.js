import goToMeetingTicketGrades from '@/pages/meetings/one/ticket-grades/goToMeetingTicketGrades';
import goToRecentMeetings from '@/pages/meetings/goToRecentMeetings';
import openModal from '@/utils/modal';

export default (meetingId, options) => openModal({
  title: '领取失败',
  content: '手慢了，门票已被其他小伙伴领走了',
  confirmText: '自己买',
  cancelText: '回首页',
  onConfirm: () => {
    wx.navigateBack({
      delta: 1,
    });
    goToMeetingTicketGrades(meetingId);
  },
  onCancel: () => goToRecentMeetings(),
  ...options,
});
