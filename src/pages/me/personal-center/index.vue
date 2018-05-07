<template>
  <scroll-view class="page personal-center">
    <user-card :user="currentUser" />
    <div class="container">
      <div class="list-title section-single-line" @click="goToMyTickets">
        <div>我的门票</div>
        <div class="sub-title">共{{sharableTickets.length}}张门票可赠送</div>
      </div>
      <div v-if="recentTicket" class="section-no-padding" @click="goToTicketsDetail(recentTicket.orderId)">
        <tickets-card :tickets="ticketsOfRecentMeeting" :meeting="recentMeeting" />
      </div>
    </div>
    <div class="container">
      <div class="list-title section-single-line" @click="goToMyOrders">
        <div>我的订单</div>
        <div class="sub-title">查看全部</div>
      </div>
      <div v-if="recentOrder" class="section-no-padding" @click="goToOrderDetail(recentOrder.id)" >
        <order-card :order="recentOrder" />
      </div>
    </div>
  </scroll-view>
</template>

<script>
import { mapGetters } from 'vuex';

import UserCard from '@/components/UserCard';
import TicketsCard from '@/components/TicketsCard';
import OrderCard from '@/components/OrderCard';

import getTickets from '@/methods/getTickets';
import getOrders from '@/methods/getOrders';
import goToTicketsDetail from '@/pages/orders/one/tickets/goToTicketsDetail';

const goToMyTickets = () => wx.navigateTo({
  url: '/pages/tickets/main',
});

const goToMyOrders = () => wx.navigateTo({
  url: '/pages/orders/main',
});

const goToOrderDetail = id => wx.navigateTo({
  url: `/pages/orders/one/main?id=${id}`,
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
    recentTicket() {
      if (!this.tickets.length) return null;
      return this.tickets[0];
    },
    recentMeeting() {
      if (!this.recentTicket) return null;
      return this.recentTicket.meeting;
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
    goToOrderDetail,
    goToTicketsDetail,
  },
  components: {
    UserCard,
    TicketsCard,
    OrderCard,
  },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '个人中心',
    });

    this.tickets = await getTickets();
    this.orders = await getOrders();

    // Mock navigate to orders page
    // goToMyOrders();
    // goToOrderDetail(2);
    // goToMyTickets();
    goToTicketsDetail(1);
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
