<template>
  <div @click="click" class="ticket-grade" :class="{ selected: selected, disabled: disabled }">
    <div class="ticket-grade-type">
      <image class="type-image" :src="typeImageUrl" />
      <div class="type-name">{{ticketGrade.type}}</div>
    </div>
    <div class="ticket-info bordered" :class="{ selected: selected }">
      <div class="ticket-info-header">
        <div class="ticket-price">
          <span class="ticket-price-number">{{price}}</span>
          <span class="ticket-price-unit">元/张</span>
        </div>
        <div class="ticket-rest-amount">{{restAmountDesc}}</div>
      </div>
      <div class="ticket-grade-desc">{{ticketGrade.desc}}</div>
    </div>
  </div>
</template>

<script>
import toCash from '@/utils/filters/cash';

export default {
  props: ['ticketGrade', 'selected'],
  computed: {
    typeImageUrl() {
      return `/static/ticket-grade/${this.ticketGrade.typeColor}.png`;
    },
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

<style scoped lang="less">
.ticket-grade {
  @size: 90px;

  display: flex;
  border-radius: 3px;
  height: @size;

  &:not(:first-child) {
    margin-top: 15px;
  }

  &.disabled {
    filter:opacity(0.5);

    .ticket-rest-amount {
      color: #FFA100;
    }
  }

  .ticket-grade-type {
    width: @size;
    height: 100%;
    position: relative;
    border-radius: 5px 0 0 5px;

    .type-image {
      width: @size;
      height: @size;
    }

    .type-name {
      font-size: 18px;
      line-height: 18px;
      color: white;
      white-space: nowrap;

      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .ticket-info {
    border-left-width: 0;
    border-radius: 0 5px 5px 0;
    padding: 16px 20px;
    flex: 1;

    .ticket-info-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      height: 18px;

    }

    .ticket-grade-desc {
      font-size: 12px;
      margin-top: 8px;
      color: #8A9299;

      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  .ticket-price {
    display: flex;
    align-items: baseline;

    .ticket-price-number {
      font-weight: bolder;
      font-size: 18px;
      color: #333A40;
      line-height: 18px;
    }

    .ticket-price-unit {
      margin-left: 6px;
      font-size: 12px;
      color: #8A9299;
      line-height: 12px;
    }
  }

  .ticket-rest-amount {
    font-size: 12px;
    color: #2692F0;
    letter-spacing: 0;
    text-align: right;
    line-height: 12px;
    float: right;
  }
}


</style>
