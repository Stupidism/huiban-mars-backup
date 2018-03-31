<template>
  <div @click="click" class="payment-method bordered weui-flex" :class="{ selected: selected }">
    <icon type="success" size="33" />
    <div class="payment-method-info">
      <div>{{paymentMethod.name}}</div>
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

<style scoped>
.payment-method {
  display: flex;
  align-items: center;
}

.payment-method:not(:first-child) {
  margin-top: 15px;
}

.payment-method-info {
  flex: 1;
  margin: 0 10px;
  font-size: 14px;
}

.payment-method-desc {
  font-size: 12px;
  color: grey;
}

</style>
