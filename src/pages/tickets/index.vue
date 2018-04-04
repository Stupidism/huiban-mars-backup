<template>
  <scroll-view class="page">
  </scroll-view>
</template>

<script>
  export default {
    async mounted() {
      wx.setNavigationBarTitle({
        title: '我的门票',
      });
    },
  };
</script>

<style scoped>

</style>
