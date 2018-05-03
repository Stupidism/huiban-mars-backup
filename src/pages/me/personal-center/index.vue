<template>
  <scroll-view class="page">
    <user-card :user="currentUser" />
  </scroll-view>
</template>

<script>
import { mapGetters } from 'vuex';

import UserCard from '@/components/UserCard';

export default {
  computed: {
    ...mapGetters(['currentUser']),
  },
  components: {
    UserCard,
  },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '个人中心',
    });
  },
};
</script>

<style scoped lang="less">
</style>
