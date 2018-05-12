<template>
  <div
    class="ticket-item background-image-container"
    :class="'ticket-item' + ticket.gradeTypeColor"
  >
    <image class="background-image" :src="backgroundImage" />
    <div class="ticket-item-content background-image-content">
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
    },
  },
  components: { Cash },
};
</script>

<style lang="less">
.ticket-item {
  width: 150px;
  height: 100px;

  .ticket-item-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 15px;

    .grade-type {
      line-height: 1;
    }

    .price {
      color: white;
      line-height: 1;
    }
  }
}
</style>
