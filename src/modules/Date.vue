<template>
  <span>{{formattedTime}}</span>
</template>
<script>
import DateTime from './DateTime';

export default {
  props: {
    format: {
      default: 'YYYY-MM-DD',
    },
  },
  extends: DateTime,
};
</script>
<style>
</style>
