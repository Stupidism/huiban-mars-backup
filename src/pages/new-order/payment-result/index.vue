<template>
  <scroll-view class="page payment-result">
    <div v-if="isCompleted" class="container">
      <div class="section content-vertical">
        <image class="icon huge" src="/static/icons/check-circle.png" />
        <div class="result-desc text large success">支付成功</div>
        <div class="text secondary">门票信息已通过短信发送至{{protectedCurrentUserPhone}}</div>
        <div class="text secondary">请注意查收</div>
      </div>
    </div>
    <div v-else class="container">
      <div class="section content-vertical">
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
      <scroll-view scroll-x="true" class="section sharable-tickets-radio content-horizontal">
        <div
          class="ticket-card"
          :class="'ticket-card' + ticket.gradeTypeColor"
          v-for="ticket in sharableTickets"
          :key="ticket.id"
          @click="setRuntime({ sharedTicket: ticket })"
        >
          <image class="background-image" :src="'/static/ticket/' + ticket.gradeTypeColor + '.png'" />
          <div class="ticket-card-content">
            <span class="grade-type text large">{{ticket.gradeType}}</span>
            <span class="price sub-title">价值 <cash :amount="ticket.price" /> 元</span>
          </div>
          <image
            v-if="sharedTicket.id === ticket.id"
            class="ticket-card-check icon"
            src="/static/icons/check-circle-anti-color.png"
          />
        </div>
      </scroll-view>
      <div class="section">
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

import { wxRequest, ticketList } from '@/apis';
import { example as ticketsExample } from '@/apis/tickets/list';
import getOrder from '@/mixins/get-order';
import SubmitFooter from '@/components/SubmitFooter';
import Cash from '@/modules/Cash';

const getSharableTickets = async (orderId) => {
  try {
    const sharableTickets = await wxRequest(ticketList({ orderId, status: 'no_participant' }));
    return sharableTickets;
  } catch (e) {
    if (e.errMsg === 'request:fail url not in domain list') {
      return ticketsExample
        .filter(ticket => ticket.status === 'no_participant');
    }
    console.error(e);
    console.error(e.statusCode, e.data);
    throw e;
  }
};

export default {
  data: {
    order: {},
    sharableTickets: [],
  },
  computed: {
    isCompleted() {
      return this.order.status === 'completed';
    },
    ...mapState({
      user: 'userInfo',
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
    shareWithFriend() {
      wx.showShareMenu({
        withShareTicket: true,
      });
    },
    ...mapMutations('runtime', ['setRuntime']),
  },
  mixins: [getOrder],
  components: {
    SubmitFooter,
    Cash,
  },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '支付结果',
    });
    wx.hideShareMenu();

    const orderId = this.$root.$mp.query.order || 1;
    await this.getOrder(orderId);
    this.sharableTickets = await getSharableTickets(orderId);
    this.setRuntime({ sharedTicket: this.sharableTickets[0] });
    // Mock navigate to new-order page
    // this.onSubmit();
    // TODO: remove mock code above
  },
  onShareAppMessage(res) {
    return {
      title: `送您一张${res.target.dataset.ticketGradeType}`,
      path: '/page/tickets/acquire/main?id=1',
      imageUrl: `/static/ticket/${this.sharedTicket.gradeTypeColor}.png`,
      success() {
        wx.navigateTo({
          url: '/pages/tickets/share-result/main',
        });
      },
      fail(error) {
        // 转发失败
        console.log('share failed', error);
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
  justify-content: flex-start;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
  padding-left: 0;
  padding-right: 0;
  height: 100px;

  .ticket-card {
    display: inline-block;
    position: relative;
    width: 150px;
    height: 100px;

    &:first-child {
      margin-left: 15px;
    }

    &:not(:first-child) {
      margin-left: 10px;
    }

    & > .background-image {
      position: absolute;
      width: 150px;
      height: 100px;
      top: 0;
      left: 0;
    }

    .ticket-card-check {
      position: absolute;
      right: 10px;
      top: 10px;
    }

    .ticket-card-content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 15px;

      .grade-type {
        color: white;
        line-height: 1;
      }

      .price {
        color: white;
        line-height: 1;
      }
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
