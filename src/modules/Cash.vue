<template>
  <span>{{formattedAmount}}</span>
</template>
<script>
import toCash from '@/utils/filters/cash';

export default {
  props: ['amount'],
  computed: {
    formattedAmount() {
      return toCash(this.amount);
    }
  },
};
</script>
