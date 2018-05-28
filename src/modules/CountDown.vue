<template>
  <span>{{formattedLeftNum}}</span>
</template>

<script>
export default {
  data() {
    return {
      leftNum: this.num,
    };
  },
  props: {
    num: Number,
    step: { type: Number, default: -1 },
    timeInterval: { type: Number, default: 1000 },
    format: Function,
    onCountDown: Function,
  },
  computed: {
    formattedLeftNum() {
      if (this.format) return this.format(this.leftNum);
      return this.leftNum;
    },
  },
  mounted() {
    this.interval = setInterval(() => {
      this.leftNum = this.leftNum + this.step;
      if (this.onCountDown) {
        const stopCountDown = this.onCountDown(this.leftNum);
        if (stopCountDown) {
          clearInterval(this.interval);
        }
      }
    }, this.timeInterval);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>
