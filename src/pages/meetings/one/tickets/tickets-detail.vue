<template>
  <scroll-view class="page tickets-detail">
    <div v-if="meeting" class="container">
      <meeting-banner :meeting="meeting" />
    </div>
    <div class="container my-tickets">
      <div class="section-single-line">我的门票</div>
      <div class="section-no-padding tickets-list">
        <ticket-row
          v-for="ticket in myTickets"
          :key="ticket.id"
          :ticket="ticket"
        />
      </div>
    </div>
    <div class="container sharable-tickets">
      <div class="section-single-line">可赠送的门票</div>
      <div class="section-no-padding tickets-list">
        <ticket-row
          v-for="ticket in sharableAndSharedTickets"
          :key="ticket.id"
          :ticket="ticket"
          show-share-info
        />
      </div>
    </div>
  </scroll-view>
</template>

<script>
import { mapState } from 'vuex';

import MeetingBanner from '@/components/MeetingBanner';
import TicketRow from '@/components/TicketRow';

import { addTypeColorForTicketGrades } from '@/methods/getMeeting';
import getTickets from '@/methods/getTickets';

export default {
  data() {
    return {
      tickets: [],
    };
  },
  computed: {
    myTickets() {
      return this.tickets.sort((ticketA, ticketB) => {
        // 本人参加的门票排前面
        // 未有人参加的门票排中间
        // 别人参加的门票排后面

        // 如果A是本人参加就不用调换位置
        if (ticketA.participantId === this.currentUser.id) return -1;
        // 如果B是本人参加就把B调到A前面去
        if (ticketB.participantId === this.currentUser.id) return 1;
        // 如果A还没人参加就不用调换位置
        if (ticketA.status === 'no_participant') return -1;
        // 如果B还没人参加就把B调到A前面去
        if (ticketB.status === 'no_participant') return 1;
        // 其他情况下不用调换位置
        return -1;
      });
    },
    sharableAndSharedTickets() {
      // 这里虽然叫做"可赠送的门票", 但其实还包含已经被人领取了的门票
      return this.myTickets
        .filter(ticket => ticket.buyerId === this.currentUser.id)
        .filter(ticket => ticket.participantId !== this.currentUser.id);
    },
    meeting() {
      if (!this.tickets.length) return null;
      const recentMeeting = this.tickets[0].meeting;
      return {
        ...recentMeeting,
        ticketGrades: addTypeColorForTicketGrades(recentMeeting.ticketGrades),
      };
    },
    ...mapState(['currentUser']),
  },
  components: {
    MeetingBanner,
    TicketRow,
  },
  async mounted() {
    this.tickets = await getTickets({
      meetingId: this.$root.$mp.query.meetingId,
      orderId: this.$root.$mp.query.orderId,
      populate: 'meeting.ticketGrades',
    });
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
