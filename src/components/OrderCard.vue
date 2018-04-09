<template>
  <div class="order-intro">
    <div class="meeting-cover-wrapper">
      <img class="meeting-cover" src="/static/default-meeting-cover.png" alt="封面图片" />
      <div class="meeting-status">{{order.meeting.statusDesc}}</div>
    </div>
    <div class="order-info">
      <div class="meeting-topic topic">{{order.meeting.topic}}</div>
      <div class="order-info-centent">
        <div>
          <div>
            <icon type="time" size="20" /><date :time="order.meeting.holdAt" />
          </div>
          <div>
            <icon type="marker" size="20" />{{order.meeting.place}}
          </div>
          <div>
            <icon type="copyright" size="20" />{{order.meeting.host}}
          </div>
        </div>
        <div class="status" :class="order.status">
          <image :src="statusImage" />
          <span>{{order.statusDesc}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Date from '@/modules/Date';

export default {
  props: ['order'],
  computed: {
    statusImage() {
      return `/static/order-status/${this.order.status}.png`;
    }
  },
  components: { Date },
};
</script>

<style scoped lang="less">
.order-intro {
  display: flex;
  padding-bottom: 15px;
}

.meeting-cover-wrapper {
  width: 66px;
  height: 99px;
  position: relative;
  margin-right: 15px;
}

.meeting-status {
  position: absolute;
  bottom: 0;
  background: rgba(88, 88, 88, 0.5);
  width: 100%;
  color: white;
  text-align: center;
}

.meeting-cover {
  width: 100%;
  height: 100%;
}

.order-info {
  flex: 1;
}

.meeting-topic {
  font-size: 14px;
  padding-right: 10px;
}

.order-info-centent {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.status {
  position: relative;
  @size: 53px;
  width: @size;
  height: @size;
  font-size: 14px;

  image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    white-space: nowrap;
  }

  &.completed {
    color: #33CC33;
  }
  &.to_be_paid {
    color: #CC0000;
  }
  &.cancalled,
  &.closed {
    color: #999999;
  }
}

</style>
