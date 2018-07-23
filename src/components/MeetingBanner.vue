<template>
  <div class="meeting-banner background-image-container">
    <image class="background-image" :src="bannerImageUrl" />
    <div class="info background-image-content">
      <div class="topic">{{meeting.topic}}</div>
      <div class="english-topic">{{meeting.englishTopic}}</div>
      <div class="hold-time">
        <div class="fancy-wire"></div>
        <date :time="meeting.holdAt" />
        <div class="fancy-wire"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Date from '@/modules/Date';

export default {
  props: ['meeting'],
  computed: {
    bannerImageUrl() {
      return this.meeting && this.meeting.bannerImg;
    },
  },
  components: { Date },
};
</script>

<style scoped lang="less">
.meeting-banner {
  height: 250px;

  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 50px;
  }

  .english-topic {
    margin-top: 10px;
    font-size: 16px;
  }

  .hold-time {
    display: flex;
    align-items: center;
    margin-top: 22px;
    font-size: 12px;

    .fancy-wire {
      margin: 9px;
      display: inline-block;
      width: 41px;
      height: 2px;
      background: white;
    }
  }
}
</style>
