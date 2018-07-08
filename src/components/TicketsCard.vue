<template>
  <div class="ticket-card section-no-padding">
    <meeting-card v-if="meeting" :meeting="meeting" />
    <div class="section-single-line">
      共 {{giftNum}} 个赠送名额，还剩 <span class="sharable-num">{{sharableTickets.length}}</span> 个
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
