<template>
  <div class="submit-footer weui-footer weui-footer_fixed-bottom">
    <span class="summary-content">
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
  },
};
</script>

<style scoped>
.submit-footer {
  bottom: 0;
  display: flex;
  background: white;
  border-top: 1px #bbb solid;
}

.summary-content {
  display: flex;
  flex: 3;
  align-items: center;
  padding: 15px;
  justify-content: space-between;
}

.submit-btn {
  flex: 2;
  border-radius: 0;
}
</style>
