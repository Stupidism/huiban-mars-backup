<template>
  <scroll-view
    class="select-ticket-grade page page-with-footer"
    :class="{'with-high-footer': orderItem.ticketGrade.id != null}"
  >
    <div class="container">
      <meeting-banner :meeting="meeting" />
      <location-row v-bind="meeting" />
    </div>

    <div class="ticket-grades-radio container">
      <div class="title section-single-line">
        <span>选择票档</span>
        <span class="sub-title">（贵宾票不参与买一赠一活动）</span>
      </div>

      <div class="section">
        <ticket-grade
          v-for="ticketGrade in meeting.ticketGrades"
          :key="ticketGrade.id"
          :ticket-grade="ticketGrade"
          :selected="ticketGrade.id === orderItem.ticketGrade.id"
          @select="setTicketGrade(ticketGrade)"
        />
      </div>
    </div>

    <div class="image-container">
      <image src="/static/coupons/buy-one-get-one-free.png" mode="widthFix" />
    </div>

    <div
      v-if="orderItem.ticketGrade.id != null"
      class="amount-radio section"
    >
      <div class="amount-radio-title">
        数量：
      </div>
      <div class="amount-btn-group">
        <span
          v-for="amount in [1,2,3,4,5]"
          class="amount-btn"
          :class="{ selected: amount === orderItem.amount }"
          :key="amount"
          @click="setAmount(amount)"
          v-if="orderItem.ticketGrade.restAmount >= amount"
        >
          {{amount}}
        </span>
      </div>
    </div>

    <div class="footer">
      <div class="section flex justified grow">
        <div class="flex aligned">
          合计：
          <span class="sum-price-amount"><cash :amount="sumPrice" /></span>
          <span class="sum-price-unit">元</span>
        </div>
        <div @click="openPurchaseNotes" class="purchase-notes">
          《购票须知》
        </div>
      </div>
      <button class="primary large narrow" :disabled="!sumPrice" @click="startOrder">
        提交
      </button>
    </div>

    <div v-if="isPurchaseNotesOpen" class="modal" @click="closePurchaseNotes">
      <div @click.stop class="purchase-notes-locator">
        <purchase-notes />
      </div>
      <div class="footer">
        <button class="large" @click="closePurchaseNotes">关闭</button>
      </div>
    </div>

  </scroll-view>
</template>

<script>
import getMeeting from '@/methods/getMeeting';

import MeetingBanner from '@/components/MeetingBanner';
import TicketGrade from '@/components/TicketGrade';
import PurchaseNotes from '@/components/PurchaseNotes';
import LocationRow from '@/modules/LocationRow';
import Cash from '@/modules/Cash';

import goToNewOrder from '@/pages/orders/new/goToNewOrder';

export default {
  data() {
    return {
      meeting: {},
      isPurchaseNotesOpen: false,
      orderItem: {
        ticketGrade: {},
        amount: 0,
      },
    };
  },
  computed: {
    sumPrice() {
      if (!this.orderItem.ticketGrade || !this.orderItem.amount) return 0;
      return this.orderItem.ticketGrade.price * this.orderItem.amount;
    },
  },
  methods: {
    startOrder() {
      goToNewOrder({
        meetingId: this.meeting.id,
        amount: this.orderItem.amount,
        ticketGradeId: this.orderItem.ticketGrade.id,
      });
    },
    openPurchaseNotes() {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#666666',
      });
      this.isPurchaseNotesOpen = true;
    },
    closePurchaseNotes() {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
      });
      this.isPurchaseNotesOpen = false;
    },
    setTicketGrade(ticketGrade) {
      this.orderItem.ticketGrade = ticketGrade;
      if (ticketGrade) {
        this.orderItem.amount = Math.min(this.orderItem.amount || 1, ticketGrade.restAmount);
      }
    },
    setAmount(amount) {
      this.orderItem.amount = amount;
    },
  },
  components: {
    MeetingBanner,
    TicketGrade,
    PurchaseNotes,
    LocationRow,
    Cash,
  },
  async mounted() {
    this.meeting = await getMeeting(this.$root.$mp.query.meetingId || 1);
  },
};
</script>

<style scoped lang="less">
.select-ticket-grade {
  &.with-high-footer {
    @footerGap: 120px;
    padding-bottom: @footerGap;
    min-height: calc(100vh - @footerGap);
  }

  .ticket-grades-radio {
    .title {
      display: flex;
      align-items: baseline;
    }
  }

  .amount-radio {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 50px;
    background: white;

    height: 30px;
    box-shadow: 0 -2px 2px 0 rgba(0,0,0,0.10);
    z-index: 1;

    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .amount-radio-title {
    font-weight: bolder;
    font-size: 14px;
    color: #8A9299;
    margin-right: 6px;
  }

  .amount-btn-group {
    width: calc(100% - 75px);

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .amount-btn {
    width: 40px;
    height: 30px;
    border: 1px solid rgba(0,0,0,0.06);
    border-radius: 3px;
    text-align: center;
    font-size: 14px;
    line-height: 30px;
    color: #17181A;

    &.selected {
      background: rgba(38, 146, 240, 0.10);
      border: 1px solid #2692F0;
      color: #2692F0;
    }
  }

  .sum-price-amount {
    font-size: 20px;
    color: #2692F0;
  }

  .sum-price-unit {
    margin-left: 4px;
    color: #2692F0;
  }

  .purchase-notes-locator {
    position: absolute;
    bottom: 50px;
  }
}
</style>
