<template>
  <scroll-view class="page root">
    <div
      class="container"
      v-for="order in orders"
      :key="order.id"
      @click="goToOrder(order.id)"
    >
      <order-card :order="order" />
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
