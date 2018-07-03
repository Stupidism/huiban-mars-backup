<template>
  <scroll-view class="page">
    <div
      v-for="(tickets, meetingId) in ticketsGroupByMeeting"
      :key="meetingId"
      @click="goToTicketsDetail(meetingId)"
      class="container"
    >
      <tickets-card :tickets="tickets" :meeting="tickets[0].meeting" />
    </div>
  </scroll-view>
</template>
<script>
import _ from 'lodash';
import TicketsCard from '@/components/TicketsCard';
import goToTicketsDetail from '@/pages/meetings/one/tickets/goToTicketsDetail';

import getTickets from '@/methods/getTickets';

const getTicketsGroupByMeeting = () => getTickets()
  .then(tickets => _.groupBy(tickets, 'meetingId'));

export default {
  data() {
    return {
      ticketsGroupByMeeting: {},
    };
  },
  methods: {
    goToTicketsDetail,
  },
  components: {
    TicketsCard,
  },
  async onShow() {
    this.ticketsGroupByMeeting = await getTicketsGroupByMeeting();
  },
};
</script>

<style scoped>

</style>
