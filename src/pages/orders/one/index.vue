<template>
  <scroll-view class="page root">
    <div v-if="order" class="section-no-padding">
      <order-card :order="order" />
    </div>
    <div class="divider solid margined-vertical"></div>
    <div class="info-table">
      <div>
        {{orderItem.ticketGradeType}}
        <span>
          ¥ <cash :amount="orderItem.ticketPrice" /> x {{orderItem.ticketAmount}}
        </span>
      </div>
    </div>
    <div class="divider solid margined-vertical"></div>
    <div class="info-table">
      <div>
        商品总价: <span>¥<cash :amount="sumPrice" /></span>
      </div>
      <div>
        折扣优惠（买一赠一）: <span>- ¥ 00.00</span>
      </div>
      <div>
        应付款: <span>¥<cash :amount="order.duePayment" /></span>
      </div>
      <div>
        实际付款:
        <span>¥<cash :amount="order.actualPayment" /></span>
      </div>
    </div>
    <div class="divider margined-vertical"></div>
    <div class="info-table">
      <div>
        姓名: <span>{{order.userName}}</span>
      </div>
      <div>
        手机号: <span>{{order.userPhone}}</span>
      </div>
    </div>
    <div class="divider margined-vertical"></div>
    <div class="info-table">
      <div>
        订单编号: <span>{{order.transaction.id}}</span>
      </div>
      <div>
        付款方式: <span>{{order.paymentMethod.typeDesc}}</span>
      </div>
      <div v-if="isCompleted">
        {{order.paymentMethod.typeDesc}}交易号: <span>{{order.transaction.thirdPartyTransactionId}}</span>
      </div>
      <div>
        下单时间: <date-time :time="order.createdAt" />
      </div>
      <div v-if="isCompleted">
        付款时间: <date-time :time="order.payedAt" />
      </div>
      <div v-if="isCompleted">
        成交时间: <date-time :time="order.finishedAt" />
      </div>
      <div v-if="order.status === 'cancelled'">
        取消时间: <date-time :time="order.cancelledAt" />
      </div>
      <div v-if="order.status === 'closed'">
        关闭时间: <date-time :time="order.meeting.enrollEndAt" />
      </div>
    </div>
    <submit-footer v-if="isCompleted" buttonName="查看门票" no-summary="true" :onSubmit="goToMyTickets" />

    <div v-if="isToBePaid" class="submit-footer weui-footer weui-footer_fixed-bottom content-horizontal">
      <span v-if="!noSummary" class="summary-content content-horizontal">
        剩余<count-down :endTime="order.meeting.enrollEndAt" />
        <button @click="cancelOrder" size="mini">取消订单</button>
      </span>
      <button class="submit-btn" :disabled="disabled" @click="goToPay">去支付</button>
    </div>
  </scroll-view>
</template>

<script>
import OrderCard from '@/components/OrderCard';
import SubmitFooter from '@/components/SubmitFooter';
import DateTime from '@/modules/DateTime';
import CountDown from '@/modules/CountDown';
import Cash from '@/modules/Cash';

import { wxRequest, orderPatch } from '@/apis';

import getOrder from '@/mixins/get-order';
import payOrder from '@/mixins/pay-order';

export default {
  data() {
    return {
      order: {
        meeting: {},
        transaction: {},
        paymentMethod: {},
      },
    };
  },
  computed: {
    orderItem() {
      if (!this.order.items) return {};
      return this.order.items[0];
    },
    sumPrice() {
      return this.orderItem.ticketPrice * this.orderItem.ticketAmount;
    },
    isCompleted() {
      return this.order.status === 'completed';
    },
    isToBePaid() {
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
      this.payOrder(this.order);
    },
    cancelOrder() {
      wxRequest(orderPatch(this.order.id, { status: 'cancelled' }));
    },
  },
  mixins: [getOrder, payOrder],
  components: { OrderCard, DateTime, Cash, SubmitFooter, CountDown },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '订单详情',
    });
    await this.getOrder(this.$root.$mp.query.id || 1);
  },
};
</script>

<style scoped lang="less">
.root {
  font-size: 12px;
}

.sum-price {
  font-size: 16px;
  color: red;
}
</style>
