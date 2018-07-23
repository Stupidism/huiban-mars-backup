<template>
  <scroll-view class="page page-with-footer payment-result">
    <div v-if="order" class="container">
      <div v-if="isCompleted" class="section flex aligned vertically">
        <image class="icon huge" src="/static/icons/check-circle.png" />
        <div class="result-desc text large success">支付成功</div>
        <div class="text secondary">门票信息已通过短信发送至{{protectedCurrentUserPhone}}</div>
        <div class="text secondary">请注意查收</div>
      </div>
      <div v-else class="section flex aligned vertically">
        <image class="icon huge" src="/static/icons/close-circle.png" />
        <div class="result-desc text large warning">支付失败</div>
        <div class="text secondary">请检查订单状态</div>
        <div class="text secondary">并尽快在15分钟内完成支付</div>
      </div>
    </div>
    <div v-if="isCompleted" class="container">
      <div class="section-single-line title">
        可赠送的门票 <span class="sub-title">（{{sharableTickets.length}}）</span>
      </div>
      <scroll-view scroll-x="true" class="section sharable-tickets-radio">
        <div
          class="sharable-tickets-radio-item"
          v-for="ticket in sharableTickets"
          :key="ticket.id"
          @click="setRuntime({ sharedTicket: ticket })"
        >
          <ticket-item :ticket="ticket" />
          <image
            v-if="sharedTicket.id === ticket.id"
            class="ticket-card-check icon"
            src="/static/icons/check-circle-anti-color.png"
          />
        </div>
      </scroll-view>
      <div class="section flex aligned vertically">
        <button class="share-btn primary" open-type="share">
          送给Ta
        </button>
      </div>
    </div>
    <div class="image-container">
      <image src="/static/coupons/buy-one-get-one-free.png" mode="widthFix" />
    </div>
    <div class="footer" :class="{'footer-iphonex': isIphonex}">
      <button class="large" @click="onSubmit">查看{{isCompleted ? '门票' : '订单'}}</button>
    </div>
  </scroll-view>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

import getOrder from '@/methods/getOrder';
import TicketItem from '@/components/TicketItem';
import Cash from '@/modules/Cash';

import getTickets from '@/methods/getTickets';
import goToShareResult from '@/pages/tickets/share-result/goToShareResult';
import goToOrderDetail from '@/pages/orders/one/goToOrderDetail';
import goToTicketsDetail from '@/pages/meetings/one/tickets/goToTicketsDetail';
import buildTicketShareOptions from '@/methods/buildTicketShareOptions';

export default {
  data() {
    return {
      order: null,
      sharableTickets: [],
    };
  },
  computed: {
    isCompleted() {
      return this.order && this.order.status === 'completed';
    },
    ...mapState(['currentUser']),
    ...mapState('runtime', ['sharedTicket', 'isIphonex']),
    ...mapGetters(['protectedCurrentUserPhone']),
  },
  methods: {
    onSubmit() {
      if (this.isCompleted) {
        goToTicketsDetail({ orderId: this.order.id });
      } else {
        goToOrderDetail(this.order.id);
      }
    },
    async getSharableTickets(orderId) {
      const tickets = await getTickets({ orderId, status: 'no_participant' });

      if (tickets.length) {
        this.sharableTickets = tickets.filter(ticket => ticket.status === 'no_participant');
        if (this.sharableTickets.length) {
          this.setRuntime({ sharedTicket: this.sharableTickets[0] });
        }

        if (this.interval) {
          clearInterval(this.interval);
          this.interval = null;
        }

        return;
      }

      if (!this.interval) {
        this.interval = setInterval(() => this.getSharableTickets(orderId), 500);
      }
    },
    ...mapMutations('runtime', ['setRuntime']),
  },
  components: {
    Cash,
    TicketItem,
  },
  async onShow() {
    const orderId = this.$root.$mp.query.orderId || 559;
    this.getSharableTickets(orderId);
    this.order = await getOrder(orderId);
  },
  onShareAppMessage() {
    return buildTicketShareOptions({
      user: this.currentUser,
      ticket: this.sharedTicket,
      success: goToShareResult,
    });
  },
};
</script>

<style scoped lang="less">
.payment-result {
  .result-desc {
    margin: 12px 0;
  }
}

.sharable-tickets-radio {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  padding-left: 0;
  padding-right: 0;
  height: 100px;

  .sharable-tickets-radio-item {
    display: inline-block;
    position: relative;

    &:first-child {
      margin-left: 15px;
    }

    &:not(:first-child) {
      margin-left: 10px;
    }

    .ticket-card-check {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
}

.share-btn {
  width: 150px;
  height: 40px;
  font-size: 14px;
  line-height: 40px;
}

</style>
