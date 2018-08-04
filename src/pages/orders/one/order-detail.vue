<template>
  <scroll-view
    v-if="order"
    class="page page-with-footer order-detail"
    :class="{'page-iphonex': isIphonex}"
  >
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
        折扣优惠（买一赠一） <span class="info-table-value price">- ¥ <cash :amount="waiverPayment" /></span>
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
      <div v-if="order.transaction" class="info-table-line">
        订单编号 <span class="info-table-value">{{order.transaction.id}}</span>
      </div>
      <div v-if="order.paymentMethod" class="info-table-line">
        付款方式 <span class="info-table-value">{{order.paymentMethod.typeDesc}}</span>
      </div>
      <div v-if="isCompleted && order.transaction" class="info-table-line">
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
      <div v-if="order.status === 'closed' && order.meeting" class="info-table-line">
        关闭时间 <span class="info-table-value"><date-time :time="order.meeting.enrollEndAt" /></span>
      </div>
    </div>

    <div v-if="isToBePaid" class="footer">
      <span class="flex justified grow section aligned">
        <div>
          剩余:
          <span class="text danger extreme-large">
            <count-down-time :endTime="duePaidAt" />
          </span>
        </div>
        <button @click="onCancelClick" class="large narrow">取消订单</button>
      </span>
      <button class="primary large narrow" :disabled="disabled" @click="goToPay">去支付</button>
    </div>
    <div v-if="isCompleted" class="footer">
      <button class="large" @click="goToTicketsDetail({ orderId: order.id })">查看门票</button>
    </div>
  </scroll-view>
</template>

<script>
import { mapState } from 'vuex';
import addMinutes from 'date-fns/add_minutes';

import MeetingCard from '@/components/MeetingCard';
import DateTime from '@/modules/DateTime';
import CountDownTime from '@/modules/CountDownTime';
import Cash from '@/modules/Cash';

import getOrder from '@/methods/getOrder';
import cancelOrder from '@/methods/cancelOrder';
import payTransactionForOrder from '@/methods/payTransactionForOrder';
import goToTicketsDetail from '@/pages/meetings/one/tickets/goToTicketsDetail';

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
      return this.orderItem.ticketPrice * this.orderItem.ticketAmount * 2;
    },
    waiverPayment() {
      if (!this.orderItem) return 0;
      return this.sumPrice - this.order.actualPayment;
    },
    isCompleted() {
      if (!this.order) return false;
      return this.order.status === 'completed';
    },
    isToBePaid() {
      if (!this.order) return false;
      return this.order.status === 'to_be_paid';
    },
    duePaidAt() {
      if (!this.order) return null;
      return addMinutes(this.order.createdAt, 15);
    },
    ...mapState('runtime', ['isIphonex']),
  },
  methods: {
    goToTicketsDetail,
    goToPay() {
      payTransactionForOrder(this.order);
    },
    async onCancelClick() {
      const newOrder = await cancelOrder(this.order.id);
      if (newOrder) {
        this.order = {
          ...this.order,
          ...newOrder,
        };
      }
    },
  },
  components: {
    MeetingCard,
    DateTime,
    Cash,
    CountDownTime,
  },
  async onShow() {
    this.order = await getOrder(this.$root.$mp.query.id || 552);
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
