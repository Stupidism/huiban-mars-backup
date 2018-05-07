<template>
  <scroll-view class="page">
    <div
      v-for="(tickets, orderId) in ticketsGroupByOrder"
      :key="orderId"
      @click="goToTicketsDetail(orderId)"
      class="container"
    >
      <tickets-card :tickets="tickets" :meeting="tickets[0].meeting" />
    </div>
  </scroll-view>
</template>
<script>
import _ from 'lodash';
import TicketsCard from '@/components/TicketsCard';
import goToTicketsDetail from '@/pages/orders/one/tickets/goToTicketsDetail';

import getTickets from '@/methods/getTickets';

const getTicketsGroupByOrder = () => getTickets()
  .then(tickets => _.groupBy(tickets, 'orderId'));

export default {
  data() {
    return {
      ticketsGroupByOrder: {},
    };
  },
  methods: {
    goToTicketsDetail,
  },
  components: {
    TicketsCard,
  },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '我的门票',
    });

    this.ticketsGroupByOrder = await getTicketsGroupByOrder();
  },
};
</script>

<style scoped>

</style>
