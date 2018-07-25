<template>
  <div class="meeting-card section">
    <div class="meeting-cover background-image-container" @click.stop="goToMeetingDetail(meeting.id)">
      <image class="background-image" :src="coverImg" alt="封面图片" mode="aspectFill" />
      <div v-if="!hideStatus" class="meeting-status">{{meeting.statusDesc}}</div>
    </div>
    <div class="meeting-info">
      <div class="meeting-topic topic">{{meeting.topic}}</div>
      <div class="meeting-info-centent">
        <div class="meeting-info-content-line">
          <image class="icon tiny info-icon" src="/static/icons/time.svg" /><date :time="meeting.holdAt" />
        </div>
        <div class="meeting-info-content-line">
          <image class="icon tiny info-icon" src="/static/icons/marker-grey.svg" />{{meeting.place}}
        </div>
        <div class="meeting-info-content-line">
          <image class="icon tiny info-icon" src="/static/icons/company.svg" />{{meeting.host}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Date from '@/modules/Date';
import goToMeetingDetail from '@/pages/meetings/one/goToMeetingDetail';

export default {
  props: {
    meeting: {},
    hideStatus: {
      type: Boolean,
    },
  },
  computed: {
    coverImg() {
      return this.meeting.coverImg;
    },
  },
  methods: {
    goToMeetingDetail,
  },
  components: {
    Date,
  },
};
</script>

<style scoped lang="less">
.meeting-card {
  display: flex;

  .meeting-cover {
    width: 22%;
    min-width: 82px;
    height: 110px;

    position: relative;

    .meeting-status {
      font-size: 12px;
      line-height: 20px;
      position: absolute;
      bottom: 0;
      background: rgba(0, 0, 0, 0.70);
      width: 100%;
      color: white;
      text-align: center;
    }
  }

  .meeting-info {
    margin-left: 20px;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .meeting-topic {
      font-size: 14px;
      line-height: 20px;
    }

    .meeting-info-centent {
      .meeting-info-content-line {
        font-size: 12px;
        line-height: 12px;
        color: #8A9299;

        display: flex;

        &:not(:first-child) {
          margin-top: 8px;
        }

        .info-icon {
          margin-right: 10px;
        }
      }
    }
  }

}
</style>
