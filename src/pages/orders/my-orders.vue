<template>
  <scroll-view class="page root">
    <div
      class="container"
      v-for="order in orders"
      :key="order.id"
      @click="goToOrder(order.id)"
    >
      <order-card :order="order" :onCancel="onCancelRecentOrder" />
    </div>
  </scroll-view>
</template>

<script>
import OrderCard from '@/components/OrderCard';

import getOrders from '@/methods/getOrders';

const goToOrder = id => wx.navigateTo({
  url: `/pages/orders/one/main?id=${id}`,
});

export default {
  data() {
    return {
      orders: [],
    };
  },
  methods: {
    goToOrder,
    onCancelRecentOrder(newOrder) {
      this.orders = this.orders.map((order) => {
        if (order.id !== newOrder.id) {
          return order;
        }

        return {
          ...order,
          ...newOrder,
        };
      });
    },
  },
  components: {
    OrderCard,
  },
  async onShow() {
    this.orders = await getOrders();
  },
};
</script>

<style scoped lang="less">
</style>
