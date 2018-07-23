<template>
  <div class="order-card section-no-padding">
    <div class="status-wrapper">
      <meeting-card v-if="order.meeting" :meeting="order.meeting" />
      <image class="order-status" :src="statusImage" />
    </div>
    <div class="section-single-line">
      <div class="order-info flex justified aligned">
        <div class="order-number">订单号：<span>{{order.id}}</span></div>
        <div class="order-summary">
          共 <span>{{order.items.length}}</span> 件商品 合计：<span>¥<cash :amount="order.duePayment" /></span>
        </div>
      </div>
      <div v-if="order.status === 'to_be_paid'" class="order-actions">
        <button class="small bordered" @click.stop="onCancelClick">
          取消订单
        </button>
        <button class="primary small" @click.stop="payTransactionForOrder(order)">
          付款
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import MeetingCard from '@/components/MeetingCard';
import Date from '@/modules/Date';
import Cash from '@/modules/Cash';

import payTransactionForOrder from '@/methods/payTransactionForOrder';
import cancelOrder from '@/methods/cancelOrder';

export default {
  props: ['order', 'onCancel'],
  computed: {
    statusImage() {
      return `/static/order-status/${this.order.status}.svg`;
    },
  },
  methods: {
    payTransactionForOrder,
    async onCancelClick() {
      const newOrder = await cancelOrder(this.order.id);
      if (newOrder && this.onCancel) {
        this.onCancel(newOrder);
      }
    },
  },
  components: {
    MeetingCard,
    Date,
    Cash,
  },
};
</script>

<style scoped lang="less">
.order-card {
  .status-wrapper {
    position: relative;
  }

  .order-status {
    position: absolute;
    bottom: 15px;
    right: 15px;

    @size: 80px;
    width: @size;
    height: @size;
  }

  .order-info {
    span {
      color: #2692F0;
    }

    .order-summary {
      font-size: 12px;
    }
  }

  .order-actions {
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;

    & > button {
      margin: 0;

      &:not(:first-child) {
        margin-left: 10px;
      }
    }
  }
}

</style>
