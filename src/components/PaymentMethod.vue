<template>
  <div @click="click" class="payment-method section" :class="{ selected: selected }">
    <image class="payment-method-icon" :src="paymentMethod.iconImg" />
    <div class="payment-method-info">
      <div>{{paymentMethod.typeDesc}}</div>
      <div class="payment-method-desc">{{paymentMethod.desc}}</div>
    </div>
    <checkbox :checked="selected" />
  </div>
</template>

<script>

export default {
  props: ['paymentMethod', 'selected'],
  computed: {
  },
  methods: {
    click(e) {
      if (!this.disabled) {
        this.$emit('select', e);
      }
    },
  },
};
</script>

<style scoped lang="less">
.payment-method {
  display: flex;
  align-items: center;

  .payment-method-icon {
    width: 40px;
    height: 40px;
  }

  .payment-method-info {
    flex: 1;
    margin: 1px 0 1px 15px;
  }

  .payment-method-desc {
    margin-top: 8px;
    color: grey;
  }
}
</style>
