<template>
  <div class="order-card">
    <meeting-card :meeting="order.meeting" />
    <div class="order-status" :class="order.status">
      <image :src="statusImage" />
      <span>{{order.statusDesc}}</span>
    </div>
  </div>
</template>

<script>
import MeetingCard from '@/components/MeetingCard';
import Date from '@/modules/Date';

export default {
  props: ['order'],
  computed: {
    statusImage() {
      return `/static/order-status/${this.order.status}.png`;
    }
  },
  components: {
    MeetingCard,
    Date,
  },
};
</script>

<style scoped lang="less">
.order-card {
  position: relative;

  .order-status {
    position: absolute;
    bottom: 15px;
    right: 15px;

    @size: 53px;
    width: @size;
    height: @size;

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
    &.cancelled,
    &.closed {
      color: #999999;
    }
  }
}

</style>
