<template>
  <scroll-view class="page page-with-tabbar meetings-list">
    <div class="flex vertically">
      <image
        class="meeting-banner"
        v-for="meeting in meetings"
        :key="meeting.id"
        :src="meeting.bannerImg"
        mode="center"
        @click="onClickMeeting(meeting)"
      />
    </div>
  </scroll-view>
</template>

<script>
import getMeetings from '@/methods/getMeetings';

export default {
  data() {
    return {
      meetings: [],
    };
  },
  methods: {
    onClickMeeting(meeting) {
      wx.navigateTo({
        url: `/pages/meetings/one/ticket-grades/main?meeting=${meeting.id}`,
      });
    },
  },
  async mounted() {
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
