<template>
  <div class="submit-footer content-horizontal">
    <span v-if="!noSummary" class="summary-content content-horizontal">
      <slot></slot>
    </span>
    <button class="submit-btn" :class="{primary: primary}" :disabled="disabled" @click="onSubmit">
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
    primary: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="less">
.submit-footer {
  position: fixed;
  bottom: 0;

  width: 100%;
  height: 50px;
  background: white;
  box-shadow: 0 0 4px 0 rgba(0,0,0,0.20);

  display: flex;

  .summary-content {
    flex: 4;
    padding: 0 15px;
    border-top: 0.5px solid #EAEAEA;
    line-height: 50px;
  }

  .submit-btn {
    flex: 1;
    min-width: 100px;
    color: #2692F0;
    text-align: center;
    line-height: 50px;

    &.primary {
      color: white;
      background: #2692F0;
    }

    &[disabled] {
      color: white;
      background: #C4C8CC;
    }
  }
}

</style>
