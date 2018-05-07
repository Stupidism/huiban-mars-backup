<template>
  <scroll-view v-if="order" class="page page-with-footer order-detail">
    <div class="container">
      <div v-if="order.meeting" class="section-no-padding">
        <meeting-card :meeting="order.meeting" />
      </div>
      <div v-if="orderItem" class="info-table section-single-line">
        <div class="info-table-line">
          {{orderItem.ticketGradeType}}
          <span class="info-table-value price">
          ¥ <cash :amount="orderItem.ticketPrice" /> * {{orderItem.ticketAmount}}
          </span>
        </div>
      </div>
    </div>

    <div class="container info-table order-info">
      <div class="section info-table-line">
        商品总价 <span class="info-table-value price">¥<cash :amount="sumPrice" /></span>
      </div>
      <div class="section info-table-line">
        折扣优惠（买一赠一） <span class="info-table-value price">- ¥ 00.00</span>
      </div>
      <div class="section info-table-line">
        应付款 <span class="info-table-value price">¥<cash :amount="order.duePayment" /></span>
      </div>
      <div class="section info-table-line">
        实际付款 <span class="info-table-value price">¥<cash :amount="order.actualPayment" /></span>
      </div>
    </div>

    <div class="container info-table user-info">
      <div class="section info-table-line">
        姓名 <span class="info-table-value">{{order.userName}}</span>
      </div>
      <div class="section info-table-line">
        手机号 <span class="info-table-value">{{order.userPhone}}</span>
      </div>
    </div>

    <div class="container-single-section info-table transaction-info">
      <div class="info-table-line">
        订单编号 <span class="info-table-value">{{order.transaction.id}}</span>
      </div>
      <div class="info-table-line">
        付款方式 <span class="info-table-value">{{order.paymentMethod.typeDesc}}</span>
      </div>
      <div v-if="isCompleted" class="info-table-line">
        交易号 <span class="info-table-value">{{order.transaction.thirdPartyTransactionId}}</span>
      </div>
      <div class="info-table-line">
        下单时间 <span class="info-table-value"><date-time :time="order.createdAt" /></span>
      </div>
      <div v-if="isCompleted" class="info-table-line">
        付款时间 <span class="info-table-value"><date-time :time="order.payedAt" /></span>
      </div>
      <div v-if="isCompleted" class="info-table-line">
        成交时间 <span class="info-table-value"><date-time :time="order.finishedAt" /></span>
      </div>
      <div v-if="order.status === 'cancelled'" class="info-table-line">
        取消时间 <span class="info-table-value"><date-time :time="order.cancelledAt" /></span>
      </div>
      <div v-if="order.status === 'closed'" class="info-table-line">
        关闭时间 <span class="info-table-value"><date-time :time="order.meeting.enrollEndAt" /></span>
      </div>
    </div>

    <submit-footer v-if="isCompleted" buttonName="查看门票" no-summary="true" :onSubmit="goToMyTickets" />

    <div v-if="isToBePaid" class="submit-footer">
      <span v-if="!noSummary" class="summary-content">
        剩余<count-down :endTime="order.meeting.enrollEndAt" />
        <button @click="cancelOrder" size="mini">取消订单</button>
      </span>
      <button class="submit-btn" :disabled="disabled" @click="goToPay">去支付</button>
    </div>
  </scroll-view>
</template>

<script>
import MeetingCard from '@/components/MeetingCard';
import SubmitFooter from '@/components/SubmitFooter';
import DateTime from '@/modules/DateTime';
import CountDown from '@/modules/CountDown';
import Cash from '@/modules/Cash';

import { wxRequest, orderPatch } from '@/apis';

import getOrder from '@/methods/getOrder';
import payTransactionForOrder from '@/methods/payTransactionForOrder';

export default {
  data() {
    return {
      order: null,
    };
  },
  computed: {
    orderItem() {
      if (!this.order || !this.order.items) return null;
      return this.order.items[0];
    },
    sumPrice() {
      if (!this.orderItem) return 0;
      return this.orderItem.ticketPrice * this.orderItem.ticketAmount;
    },
    isCompleted() {
      if (!this.order) return false;
      return this.order.status === 'completed';
    },
    isToBePaid() {
      if (!this.order) return false;
      return this.order.status === 'to_be_paid';
    },
  },
  methods: {
    goToMyTickets() {
      wx.redirectTo({
        url: `/pages/tickets/main?order=${this.order.id}`,
      });
    },
    goToPay() {
      wx.navigateBack({ delta: 2 });
      payTransactionForOrder(this.order);
    },
    cancelOrder() {
      wxRequest(orderPatch(this.order.id, { status: 'cancelled' }));
    },
  },
  components: {
    MeetingCard,
    DateTime,
    Cash,
    SubmitFooter,
    CountDown,
  },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '订单详情',
    });

    this.order = await getOrder(this.$root.$mp.query.id || 1);
  },
};
</script>

<style scoped lang="less">
.order-detail {
  .price {
    color: #2692F0;
  }

  .order-info,
  .user-info {
    padding-left: 15px;

    .section {
      padding-left: 0;
      width: auto;
    }
  }

  .transaction-info {
    &.info-table {
      .info-table-line:not(:first-child) {
        margin-top: 6px;
      }
    }
  }
}
</style>
