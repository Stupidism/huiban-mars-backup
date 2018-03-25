<template>
  <scroll-view class="page new-order">
    <meeting-card :meeting="meeting" ></meeting-card>
  </scroll-view>
</template>

<script>
import getMeeting from '@/mixins/get-meeting';
import MeetingCard from '@/components/MeetingCard';

export default {
  data() {
    return {
      meeting: {},
    };
  },
  computed: {
    amount() {
      return this.$root.$mp.query.amount;
    },
    ticketGrade() {
      return this.meeting.ticketGrades;
    },
  },
  mixins: [getMeeting],
  components: { MeetingCard },
  mounted() {
    wx.setNavigationBarTitle({
      title: '订单确认及支付',
    });
    this.getMeeting(this.$root.$mp.query.meeting || 1);
  },
};
</script>

<style scoped>

</style>
