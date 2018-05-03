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
import { wxRequest, orderList } from '@/apis';
import { example as orderssExample } from '@/apis/orders/list';

import OrderCard from '@/components/OrderCard';

const goToOrder = id => wx.navigateTo({
  url: `/pages/orders/one/main?id=${id}`,
});

const getOrders = async () => {
  try {
    const orders = await wxRequest(orderList());
    return orders;
  } catch (e) {
    if (e.errMsg === 'request:fail url not in domain list') {
      return orderssExample;
    }

    console.error(e.statusCode, e.data, e);
    throw e;
  }
};

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
  async mounted() {
    wx.setNavigationBarTitle({
      title: '我的订单',
    });
    this.orders = await getOrders();
  },
};
</script>

<style scoped lang="less">
</style>
