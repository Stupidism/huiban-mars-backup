<template>
  <scroll-view class="page">
  </scroll-view>
</template>

<script>
import MeetingBanner from '@/components/MeetingBanner';

export default {
  components: {
    MeetingBanner,
  },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '门票详情',
    });
  },
};
</script>

<style scoped>

</style>
