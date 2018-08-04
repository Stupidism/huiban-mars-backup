<template>
  <scroll-view class="page tickets-detail">
    <div v-if="meeting" class="container">
      <meeting-banner :meeting="meeting" />
    </div>
    <div class="container my-tickets">
      <div class="section-single-line">购买的门票</div>
      <div class="section-no-padding tickets-list">
        <my-own-ticket-row
          v-for="ticket in boughtTickets"
          :key="ticket.id"
          :ticket="ticket"
          :selfParticipatingMeeting="!!selfParticipatingTicket"
        />
      </div>
    </div>
    <div class="container sharable-tickets">
      <div class="section-single-line">获赠的门票</div>
      <div class="section-no-padding tickets-list">
        <my-own-ticket-row
          v-if="selfParticipatingTicket && selfParticipatingTicket.type === 'gift_ticket'"
          :ticket="selfParticipatingTicket"
          selfParticipatingMeeting
        />
        <sharable-ticket-row
          v-for="ticket in giftTickets"
          :key="ticket.id"
          :ticket="ticket"
        />
      </div>
    </div>
    <div v-if="loading">
      正在加载数据...
    </div>
    <div v-else-if="!tickets.length">
      暂无门票
    </div>
  </scroll-view>
</template>

<script>
import { mapState } from 'vuex';
import _ from 'lodash';

import MeetingBanner from '@/components/MeetingBanner';
import SharableTicketRow from '@/components/SharableTicketRow';
import MyOwnTicketRow from '@/components/MyOwnTicketRow';

import { addTypeColorForTicketGrades } from '@/methods/getMeeting';
import getTickets from '@/methods/getTickets';

export default {
  data() {
    return {
      loading: false,
      tickets: [],
    };
  },
  computed: {
    boughtTickets() {
      return _.filter(this.tickets, ['type', 'bought_ticket']);
    },
    giftTickets() {
      return _.filter(this.tickets, ({ type, participantId }) => type === 'gift_ticket' && participantId !== this.currentUser.id);
    },
    selfParticipatingTicket() {
      return _.find(this.tickets, ['participantId', this.currentUser.id]);
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
    this.loading = true;
    this.tickets = [];
    this.tickets = await getTickets({
      meetingId: this.$root.$mp.query.meetingId,
      orderId: this.$root.$mp.query.orderId,
      populate: 'meeting.ticketGrades',
    });
    this.loading = false;
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
