<template>
  <scroll-view class="page page-with-tabbar meetings-list">
    <div class="flex vertically">
      <image
        class="meeting-banner"
        v-for="meeting in meetings"
        :key="meeting.id"
        :src="meeting.bannerImg"
        mode="center"
        @click="goToMeetingTicketGrades(meeting.id)"
      />
    </div>
  </scroll-view>
</template>

<script>
import getMeetings from '@/methods/getMeetings';
import goToMeetingTicketGrades from './one/ticket-grades/goToMeetingTicketGrades';

export default {
  data() {
    return {
      meetings: [],
    };
  },
  methods: {
    goToMeetingTicketGrades,
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
