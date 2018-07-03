<template>
  <scroll-view class="page tickets-detail">
    <div v-if="meeting" class="container">
      <meeting-banner :meeting="meeting" />
    </div>
    <div class="container my-tickets">
      <div class="section-single-line">我的门票</div>
      <div class="section-no-padding tickets-list">
        <my-own-ticket-row
          v-for="ticket in myOwnTickets"
          :key="ticket.id"
          :ticket="ticket"
          :selfParticipatingMeeting="!!selfParticipatingTickets.length"
        />
      </div>
    </div>
    <div class="container sharable-tickets">
      <div class="section-single-line">可赠送的门票</div>
      <div class="section-no-padding tickets-list">
        <sharable-ticket-row
          v-for="ticket in sharableAndSharedTickets"
          :key="ticket.id"
          :ticket="ticket"
        />
      </div>
    </div>
  </scroll-view>
</template>

<script>
import { mapState } from 'vuex';

import MeetingBanner from '@/components/MeetingBanner';
import SharableTicketRow from '@/components/SharableTicketRow';
import MyOwnTicketRow from '@/components/MyOwnTicketRow';

import { addTypeColorForTicketGrades } from '@/methods/getMeeting';
import getTickets from '@/methods/getTickets';

export default {
  data() {
    return {
      tickets: [],
    };
  },
  computed: {
    myOwnTickets() {
      return [
        ...this.selfParticipatingTickets,
        ...this.noneParticipatingTickets,
        ...this.othersParticipatingTickets,
      ];
    },
    noneParticipatingTickets() {
      return this.tickets.filter(ticket => !ticket.participantId);
    },
    selfParticipatingTickets() {
      return this.tickets
        .filter(ticket => ticket.participantId && ticket.participantId === this.currentUser.id);
    },
    othersParticipatingTickets() {
      return this.tickets
        .filter(ticket => ticket.participantId && ticket.participantId !== this.currentUser.id);
    },
    sharableAndSharedTickets() {
      // 这里虽然叫做"可赠送的门票", 但其实还包含已经被人领取了的门票
      return this.myOwnTickets
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
    SharableTicketRow,
    MyOwnTicketRow,
  },
  async onShow() {
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
