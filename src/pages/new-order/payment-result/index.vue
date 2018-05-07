<template>
  <scroll-view class="page page-with-footer payment-result">
    <div v-if="isCompleted" class="container">
      <div class="section flex aligned vertically">
        <image class="icon huge" src="/static/icons/check-circle.png" />
        <div class="result-desc text large success">支付成功</div>
        <div class="text secondary">门票信息已通过短信发送至{{protectedCurrentUserPhone}}</div>
        <div class="text secondary">请注意查收</div>
      </div>
    </div>
    <div v-else class="container">
      <div class="section flex aligned vertically">
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
        <button :data-ticket-grade-type="sharedTicket.gradeType" class="share-btn primary" open-type="share">
          送给Ta
        </button>
      </div>
    </div>
    <div class="image-container">
      <image src="/static/coupons/buy-one-get-one-free.png" mode="widthFix" />
    </div>
    <submit-footer :buttonName="`查看${isCompleted ? '门票' : '订单'}`" no-summary :onSubmit="onSubmit" />
  </scroll-view>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex';

import getOrder from '@/methods/getOrder';
import SubmitFooter from '@/components/SubmitFooter';
import TicketItem from '@/components/TicketItem';
import Cash from '@/modules/Cash';

import getTickets from '@/pages/tickets/getTickets';

const getSharableTickets = orderId =>
  getTickets({ orderId, status: 'no_participant' })
    .then(tickets => tickets.filter(ticket => ticket.status === 'no_participant'));

const onShareSuccess = () => wx.navigateTo({
  url: '/pages/tickets/share-result/main',
});

export default {
  data() {
    return {
      order: {},
      sharableTickets: [],
    };
  },
  computed: {
    isCompleted() {
      return this.order.status === 'completed';
    },
    ...mapState({
      user: 'wechatUserInfo',
    }),
    ...mapState('runtime', ['sharedTicket']),
    ...mapGetters(['protectedCurrentUserPhone']),
  },
  methods: {
    onSubmit() {
      wx.navigateTo({
        url: this.isCompleted
          ? `/pages/tickets/main?order=${this.order.id}`
          : `/pages/orders/one/main?id=${this.order.id}`,
      });
    },
    ...mapMutations('runtime', ['setRuntime']),
  },
  components: {
    SubmitFooter,
    Cash,
    TicketItem,
  },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '支付结果',
    });
    wx.hideShareMenu();

    const orderId = this.$root.$mp.query.order || 1;
    this.order = await getOrder(orderId);
    this.sharableTickets = await getSharableTickets(orderId);
    this.setRuntime({ sharedTicket: this.sharableTickets[0] });
    // Mock navigate to share-result page
    // onShareSuccess();
    // TODO: remove mock code above

    // Mock navigate to new-order page
    // this.onSubmit();
    // TODO: remove mock code above
  },
  onShareAppMessage(res) {
    return {
      title: `送您一张${res.target.dataset.ticketGradeType}`,
      path: '/page/tickets/acquire/main?id=1',
      imageUrl: `/static/ticket/${this.sharedTicket.gradeTypeColor}.png`,
      success: onShareSuccess,
      fail(error) {
        // 转发失败
        console.error('share failed', error);
      },
    };
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
