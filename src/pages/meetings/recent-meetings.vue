<template>
  <scroll-view class="page page-with-tabbar meetings-list">
    <div class="flex vertically">
      <image
        class="meeting-banner"
        v-for="meeting in meetings"
        :key="meeting.id"
        :src="meeting.bannerImg"
        mode="aspectFill"
        @click="goToMeetingDetail(meeting.id)"
      />
    </div>
  </scroll-view>
</template>

<script>
import redirector from '@/mixins/redirector';

import getMeetings from '@/methods/getMeetings';
import goToMeetingDetail from './one/goToMeetingDetail';

export default {
  data() {
    return {
      meetings: [],
    };
  },
  methods: {
    goToMeetingDetail,
  },
  mixins: [
    redirector,
  ],
  async onShow() {
    this.meetings = await getMeetings();
  },
};
</script>

<style scoped lang="less">
.meetings-list {
  padding: 15px;

  .meeting-banner {
    width: 100%;
    height: 120px;
    border-radius: 5px;
    background-color: white;

    &:not(:first-child) {
      margin-top: 10px;
    }
  }
}
</style>
