<template>
  <div class="ticket-card section-no-padding">
    <meeting-card v-if="meeting" :meeting="meeting" />
    <div class="section-single-line flex justified">
      <div>共 {{tickets.length}} 张门票</div>
      <div>可赠送 <span class="sharable-num">{{sharableTickets.length}}</span> 张</div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';
import MeetingCard from '@/components/MeetingCard';

export default {
  props: ['meeting', 'tickets'],
  computed: {
    giftNum() {
      return this.tickets.length - this.selfParticipatingTickets.length;
    },
    selfParticipatingTickets() {
      return _.filter(this.tickets, ['participantId', this.currentUser.id]);
    },
    sharableTickets() {
      return this.tickets.filter(({ status }) => status === 'no_participant');
    },
    ...mapState(['currentUser']),
  },
  components: { MeetingCard },
};
</script>

<style scoped lang="less">
.ticket-card {
  .sharable-num {
    color: #2692F0;
  }
}
</style>
