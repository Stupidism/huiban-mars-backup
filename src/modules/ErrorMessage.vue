<template>
  <div v-if="show" class="text small danger">{{message}}</div>
</template>

<script>
  export default {
    props: {
      show: Boolean,
      message: String,
    },
  };
</script>
