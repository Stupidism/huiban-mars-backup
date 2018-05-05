<template>
  <scroll-view class="page">
  </scroll-view>
</template>

<script>
  export default {
    async mounted() {
      wx.setNavigationBarTitle({
        title: '门票详情',
      });
    },
  };
</script>

<style scoped>

</style>
