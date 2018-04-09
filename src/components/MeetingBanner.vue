<template>
  <div class="meeting-banner">
    <div class="banner">
      <image class="banner-image" :src="bannerImageUrl" />
      <div class="info">
        <div class="topic">{{meeting.topic}}</div>
        <div class="english-topic">{{meeting.englishTopic}}</div>
        <div class="hold-time">
          <div class="fancy-wire"></div>
          <date :time="meeting.holdAt" />
          <div class="fancy-wire"></div>
        </div>
      </div>
    </div>
    <div class="locate-place" @click="showInMap">
      <span class="place-content">
        <image class="icon mini marker" src="/static/icons/marker.png" />
        <span class="place">{{meeting.place}}</span>
      </span>
      <image class="icon mini right-arrow" src="/static/icons/right-arrow.png" />
    </div>
  </div>
</template>

<script>
import Date from '@/modules/Date';

export default {
  props: ['meeting'],
  computed: {
    bannerImageUrl() {
      const bannerImg = this.meeting && this.meeting.bannerImg;
      return bannerImg || '/static/default-meeting-banner.png';
    },
  },
  methods: {
    showInMap() {
      const { latitude, longitude, place, address } = this.meeting;
      wx.openLocation({
        latitude,
        longitude,
        scale: 28,
        name: place,
        address,
      });
    },
  },
  components: { Date },
};
</script>

<style scoped lang="less">
.meeting-banner {
  .banner {
    display: flex;
    position: relative;
  }

  .info {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: white;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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

  .banner-image {
    width: 100%;
  }

  .locate-place {
    font-size: 14px;
    color: #17181A;
    padding: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .place-content {
      display: flex;
      align-items: center;

      .marker {
        margin: 0 2.5px;
      }

      .place {
        margin: 0 10px;
      }
    }
  }
}


</style>
