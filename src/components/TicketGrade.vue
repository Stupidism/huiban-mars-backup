<template>
  <div @click="click" class="ticket-grade weui-flex" :class="{ selected: selected, disabled: disabled }">
    <div class="ticket-info weui-flex__item">
      <div class="ticket-info-header weui-media-box__title weui-media-box__title_in-text weui-flex">
        <span>{{ticketGrade.type}}</span>
        <span class="ticket-rest-amount">{{restAmountDesc}}</span>
      </div>
      <div class="weui-media-box__desc">{{ticketGrade.desc}}</div>
    </div>
    <div class="ticket-price weui-flex__item weui-flex">
      <div class="ticket-price-number">{{price}}</div>
      <div class="ticket-price-unit">元/张</div>
    </div>
  </div>
</template>

<script>
import toCash from '@/utils/filters/cash';

export default {
  props: ['ticketGrade', 'selected'],
  computed: {
    disabled() {
      return !this.ticketGrade.restAmount;
    },
    price() {
      return toCash(this.ticketGrade.price);
    },
    restAmountDesc() {
      const { amount = 1, restAmount = 0 } = this.ticketGrade;
      if (!amount || !restAmount) return '售罄';
      const restProportion = restAmount / amount;
      if (restProportion > 0.6) {
        return '有票';
      }
      if (restProportion > 0.2) {
        return '少量';
      }
      return `剩余${restAmount}`;
    },
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
.ticket-grade {
  padding: 15px;
  border: 1px solid #bbb;
}

.ticket-grade.selected {
  border: 2px solid #444444;
}

.ticket-grade.disabled {
  background: #ddd;
}

.ticket-grade:not(:first-child) {
  margin-top: 15px;
}

.ticket-info {
  padding-right: 15px;
  flex: 3;
}

.ticket-info-header {
  justify-content: space-between;
}

.ticket-rest-amount {
  color: grey;
}

.ticket-price {
  flex: 1;
  border-left: #bbb 1px dashed;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.ticket-price-number {
  font-weight: bolder;
}

.ticket-price-unit {
  font-size: 12px;
  color: grey;
}

</style>
