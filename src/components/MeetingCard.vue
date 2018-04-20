<template>
  <div class="meeting-card">
    <image class="meeting-cover" src="/static/default-meeting-cover.png" alt="封面图片" mode="aspectFill" />
    <div class="meeting-info">
      <div class="meeting-topic topic">{{meeting.topic}}</div>
      <div class="meeting-info-centent">
        <div class="meeting-info-content-line">
          <image class="icon tiny info-icon" src="/static/icons/marker.png" />{{' '}}<date :time="meeting.holdAt" />
        </div>
        <div class="meeting-info-content-line">
          <image class="icon tiny info-icon" src="/static/icons/marker.png" />{{meeting.place}}
        </div>
        <div class="meeting-info-content-line">
          <image class="icon tiny info-icon" src="/static/icons/marker.png" />{{meeting.host}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Date from '@/modules/Date';

export default {
  props: ['meeting'],
  components: { Date },
};
</script>

<style scoped lang="less">
.meeting-card {
  display: flex;

  background: white;
  padding: 15px;

  .meeting-cover {
    width: 82px;
    height: 110px;
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
