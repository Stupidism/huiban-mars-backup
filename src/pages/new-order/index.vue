<template>
  <scroll-view class="page new-order">
    <meeting-card :meeting="meeting" mini="true" />
    <divider />
  </scroll-view>
</template>

<script>
import getMeeting from '@/mixins/get-meeting';
import MeetingCard from '@/components/MeetingCard';
import Divider from '@/components/Divider';

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
  components: { MeetingCard, Divider },
  mounted() {
    wx.setNavigationBarTitle({
      title: '订单确认及支付',
    });
    this.getMeeting(this.$root.$mp.query.meeting || 1);
  },
};
</script>

<style scoped>
.new-order {
  padding: 0 10px 200px;
  width: auto;
}
</style>
