<template>
  <scroll-view class="page">
  </scroll-view>
</template>

<script>
import getOrder from '@/mixins/get-order';

export default {
  mixins: [getOrder],
  async mounted() {
    wx.setNavigationBarTitle({
      title: '订单详情',
    });
    await this.getOrder(this.$root.$mp.query.id || 1);
  },
};
</script>

<style scoped>

</style>
