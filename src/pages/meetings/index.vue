<template>
  <scroll-view class="page meetings-list">
    <div class="content-vertical">
      <image
        class="meeting-cover"
        v-for="meeting in meetings"
        :key="meeting.id"
        :src="meeting.coverImg"
        mode="center"
        @click="onClickMeeting(meeting)"
      />
    </div>
  </scroll-view>
</template>

<script>
import { wxRequest, meetingList } from '@/apis';
import { example as meetingsExample } from '@/apis/meetings/list';

const getMeetings = async () => {
  try {
    const meetings = await wxRequest(meetingList());
    return meetings;
  } catch (e) {
    if (e.errMsg === 'request:fail url not in domain list') {
      return meetingsExample;
    }

    console.error(e.statusCode, e.data, e);
    throw e;
  }
};

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
    wx.setNavigationBarTitle({
      title: '会伴',
    });
    this.meetings = await getMeetings();
  },
};
</script>

<style scoped lang="less">
.meetings-list {
  padding: 15px;

  .meeting-cover {
    width: 100%;
    height: 120px;

    &:not(:first-child) {
      margin-top: 10px;
    }
  }
}
</style>
