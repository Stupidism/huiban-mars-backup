<template>
  <span>{{leftMinutes}}:{{leftSeconds}}</span>
</template>

<script>
import _ from 'lodash';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import differenceInSeconds from 'date-fns/difference_in_seconds';

export default {
  data() {
    return {
      time: new Date(),
    };
  },
  props: ['endTime'],
  computed: {
    leftMinutes() {
      const value = differenceInMinutes(this.endTime, this.time) % 60;
      return _.padStart(value, 2, '0');
    },
    leftSeconds() {
      const value = differenceInSeconds(this.endTime, this.time) % 60;
      return _.padStart(value, 2, '0');
    },
  },
  mounted() {
    this.interval = setInterval(() => {
      this.time = new Date();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  }
};
</script>

<style scoped>

</style>
