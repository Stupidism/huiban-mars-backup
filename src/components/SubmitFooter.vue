<template>
  <div class="submit-footer weui-footer weui-footer_fixed-bottom content-horizontal">
    <span v-if="!noSummary" class="summary-content content-horizontal">
      <slot></slot>
    </span>
    <button class="submit-btn" :disabled="disabled" @click="onSubmit">
      {{buttonName}}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    buttonName: {
      default: '提交',
    },
    onSubmit: {},
    disabled: {},
    noSummary: {
      default: false,
    },
  },
};
</script>

<style scoped>
.submit-footer {
  bottom: 0;
  background: white;
  border-top: 1px #bbb solid;
}

.summary-content {
  flex: 3;
  padding: 15px;
}

.submit-btn {
  flex: 2;
  border-radius: 0;
}
</style>
