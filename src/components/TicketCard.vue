<template>
  <div
    class="ticket-card"
    :class="'ticket-card' + ticket.gradeTypeColor"
  >
    <image class="background-image" :src="backgroundImage" />
    <div class="ticket-card-content">
      <span class="grade-type text large">{{ticket.gradeType}}</span>
      <span class="price sub-title">价值 <cash :amount="ticket.price" /> 元</span>
    </div>
  </div>
</template>

<script>
import Cash from '@/modules/Cash';

export default {
  props: ['ticket'],
  computed: {
    backgroundImage() {
      return `/static/ticket/${this.ticket.gradeTypeColor}.png`;
    }
  },
  components: { Cash },
};
</script>

<style lang="less">
.ticket-card {
  position: relative;
  width: 150px;
  height: 100px;

  & > .background-image {
    position: absolute;
    width: 150px;
    height: 100px;
    top: 0;
    left: 0;
  }

  .ticket-card-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 15px;

    .grade-type {
      color: white;
      line-height: 1;
    }

    .price {
      color: white;
      line-height: 1;
    }
  }
}
</style>
