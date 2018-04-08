<template>
  <span>{{formattedTime}}</span>
</template>
<script>
import format from 'date-fns/format';

export default {
  props: {
    time: {
      required: true,
    },
    format: {
      default: 'YYYY-MM-DD HH:mm:ss',
    },
  },
  computed: {
    formattedTime() {
      return format(this.time, this.format);
    }
  },
};

</script>
<style>
</style>
