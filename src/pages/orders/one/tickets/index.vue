<template>
  <scroll-view class="page tickets-detail">
    <div v-if="meeting" class="container">
      <meeting-banner :meeting="meeting" />
    </div>
    <div class="container my-tickets">
      <div class="section-single-line">我的门票</div>
      <div class="section-no-padding tickets-list">
        <ticket-row
          v-for="ticket in tickets"
          :key="ticket.id"
          :ticket="ticket"
        />
      </div>
    </div>
  </scroll-view>
</template>

<script>
import MeetingBanner from '@/components/MeetingBanner';
import TicketRow from '@/components/TicketRow';
import getTickets from '@/methods/getTickets';

export default {
  data() {
    return {
      tickets: [],
    };
  },
  computed: {
    meeting() {
      if (!this.tickets.length) return null;
      return this.tickets[0].meeting;
    },
  },
  components: {
    MeetingBanner,
    TicketRow,
  },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '门票详情',
    });

    const orderId = this.$root.$mp.query.orderId;
    this.tickets = await getTickets({ orderId });
  },
};
</script>

<style lang="less">
.tickets-detail {
  .my-tickets {
    .tickets-list {
      padding-left: 15px;

      .ticket-row {
        padding-left: 0;
      }
    }
  }
}
</style>
