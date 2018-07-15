<template>
  <div class="order-card section-no-padding">
    <div class="status-wrapper">
      <meeting-card v-if="order.meeting" :meeting="order.meeting" />
      <div class="order-status" :class="order.status">
        <image :src="statusImage" />
        <span>{{order.statusDesc}}</span>
      </div>
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
      return `/static/order-status/${this.order.status}.png`;
    },
  },
  methods: {
    payTransactionForOrder,
    onCancelClick() {
      wx.showModal({
        title: '取消订单',
        content: '确定取消吗?',
        cancelText: '不取消',
        confirmText: '确认取消',
        cancelColor: '#000000',
        confirmColor: '#2692F0',
        success: (res) => {
          if (res.confirm) {
            this.onCancelOrder();
          }
        },
      });
    },
    async onCancelOrder() {
      try {
        const newOrder = await cancelOrder(this.order.id);
        if (this.onCancel) {
          this.onCancel(newOrder);
        }
      } catch (e) {
        wx.showModal({
          title: '取消订单失败',
          content: '请尝试再次取消或联系客服!',
          cancelText: '知道了',
          confirmText: '再次取消',
          cancelColor: '#000000',
          confirmColor: '#2692F0',
          success: (res) => {
            if (res.confirm) {
              this.onCancelOrder();
            }
          },
        });
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

    @size: 53px;
    width: @size;
    height: @size;

    image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      white-space: nowrap;
    }

    &.completed {
      color: #33CC33;
    }
    &.to_be_paid {
      color: #CC0000;
    }
    &.cancelled,
    &.closed {
      color: #999999;
    }
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
