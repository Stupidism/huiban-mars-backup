<template>
  <scroll-view class="page personal-center">
    <user-card :user="currentUser" />
    <div class="container">
      <div class="list-title section-single-line" @click="goToMyTickets">
        <div>我的门票</div>
        <div class="sub-title">共{{sharableTickets.length}}张门票可赠送</div>
      </div>
      <ticket-card v-if="recentMeeting" :tickets="ticketsOfRecentMeeting" :meeting="recentMeeting" />
    </div>
    <div class="container">
      <div class="list-title section-single-line" @click="goToMyOrders">
        <div>我的订单</div>
        <div class="sub-title">查看全部</div>
      </div>
      <order-card v-if="recentOrder" :order="recentOrder" />
    </div>
  </scroll-view>
</template>

<script>
import { mapGetters } from 'vuex';

import UserCard from '@/components/UserCard';
import TicketCard from '@/components/TicketCard';
import OrderCard from '@/components/OrderCard';

import getTickets from '@/pages/tickets/getTickets';
import getOrders from '@/pages/orders/getOrders';

const goToMyTickets = () => wx.navigateTo({
  url: '/pages/tickets/main',
});

const goToMyOrders = () => wx.navigateTo({
  url: '/pages/orders/main',
});

export default {
  data() {
    return {
      tickets: [],
      orders: [],
    };
  },
  computed: {
    sharableTickets() {
      return this.tickets.filter(({ status }) => status === 'no_participant');
    },
    recentMeeting() {
      if (!this.tickets.length) return null;
      return this.tickets[0].meeting;
    },
    ticketsOfRecentMeeting() {
      if (!this.tickets.length || !this.recentMeeting) return [];
      return this.tickets.filter(ticket => ticket.meeting.id === this.recentMeeting.id);
    },
    recentOrder() {
      if (!this.orders.length) return null;
      return this.orders[0];
    },
    ...mapGetters(['currentUser']),
  },
  methods: {
    goToMyTickets,
    goToMyOrders,
  },
  components: {
    UserCard,
    TicketCard,
    OrderCard,
  },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '个人中心',
    });

    this.tickets = await getTickets();
    this.orders = await getOrders();

    // Mock navigate to orders page
    goToMyOrders();
    // TODO: remove mock code above
  },
};
</script>

<style scoped lang="less">
.personal-center {
  .list-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > .sub-title {
      color: #2692F0;
    }
  }
}
</style>
