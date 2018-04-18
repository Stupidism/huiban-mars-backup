<template>
  <scroll-view class="page">
    <meeting-banner :meeting="meeting" />

    <div class="ticket-grades-radio">
      <div class="title">
        <span>选择票档</span>
        <span class="sub-title">（贵宾票不参与买一赠一活动）</span>
      </div>

      <div class="divider solid" />

      <div class="ticket-grades">
        <ticket-grade
          v-for="ticketGrade in meeting.ticketGrades"
          :key="ticketGrade.id"
          :ticket-grade="ticketGrade"
          :selected="ticketGrade === selectedTicketGrade"
          @select="selectTicketGrade(ticketGrade)"
        />
      </div>
    </div>

    <div class="coupons">
      <image @click="viewNotes" src="/static/coupons/buy-one-get-one-free.png" mode="widthFix" />
    </div>

    <div
      v-if="selectedTicketGrade != null"
      class="amount-radio"
    >
      <div class="amount-radio-title">
        数量：
      </div>
      <div class="amount-btn-group">
        <span
          v-for="amount in [1,2,3,4,5]"
          class="amount-btn"
          :class="{ selected: amount === selectedAmount }"
          :key="amount"
          @click="selectAmount(amount)"
          v-if="selectedTicketGrade.restAmount >= amount"
        >
          {{amount}}
        </span>
      </div>
    </div>

    <submit-footer :onSubmit="startOrder" :disabled="!sumPrice">
      <div class="sum-price">
        合计：
        <span class="sum-price-amount">{{sumPriceInCash}} </span>
        <span class="sum-price-unit">元</span>
      </div>
      <navigator url="/page/order-notice" hover-class="navigator-hover">
        《购票须知》
      </navigator>
    </submit-footer>
  </scroll-view>
</template>

<script>
import qs from 'query-string';

import getMeeting from '@/mixins/get-meeting';
import toCash from '@/utils/filters/cash';

import MeetingBanner from '@/components/MeetingBanner';
import TicketGrade from '@/components/TicketGrade';
import SubmitFooter from '@/components/SubmitFooter';

export default {
  data() {
    return {
      meeting: {},
      selectedTicketGrade: null,
      selectedAmount: null,
    };
  },
  computed: {
    sumPrice() {
      if (!this.selectedTicketGrade || !this.selectedAmount) return 0;
      return this.selectedTicketGrade.price * this.selectedAmount;
    },
    sumPriceInCash() {
      return toCash(this.sumPrice);
    },
  },
  methods: {
    selectTicketGrade(selectedTicketGrade) {
      this.selectedTicketGrade = selectedTicketGrade;
      if (selectedTicketGrade) {
        this.selectedAmount = Math.min(this.selectedAmount, this.selectedTicketGrade.restAmount);
      }
    },
    selectAmount(amount) {
      this.selectedAmount = amount;
    },
    startOrder() {
      wx.navigateTo({
        url: `../new-order/main?${qs.stringify({
          meeting: this.meeting.id,
          amount: this.selectedAmount,
          ticketGrade: this.selectedTicketGrade.type,
        })}`,
      });
    },
  },
  components: {
    MeetingBanner,
    TicketGrade,
    SubmitFooter,
  },
  mixins: [getMeeting],
  async mounted() {
    wx.setNavigationBarTitle({
      title: '选择票档',
    });
    await this.getMeeting(this.$root.$mp.query.id || 1);

    // Mock navigate to new-order page
    // this.selectedAmount = 2;
    // this.selectedTicketGrade = this.meeting.ticketGrades[0];
    // this.startOrder();
    // TODO: remove mock code above
  },
};
</script>

<style scoped lang="less">
.ticket-grades-radio {
  background: white;
  margin-top: 10px;

  .title {
    display: flex;
    align-items: baseline;
    padding: 11.5px 15px;
  }

  .ticket-grades {
    padding: 15px;
  }
}

.coupons {
  margin-top: 10px;

  image {
    width: 100%;
  }
}

.amount-radio {
  position: fixed;
  bottom: 50px;

  width: 100%;
  height: 30px;
  padding: 15px;
  background: white;
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

  font-weight: bolder;
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
}

.amount-btn.selected {
  background: rgba(38,146,240,0.10);
  border: 1px solid #2692F0;
}

.ticket-notes {
  color: #8A9299;
}

.sum-price {
  display: flex;
  align-items: center;
}

.sum-price-amount {
  font-size: 20px;
  color: #2692F0;
}

.sum-price-unit {
  margin-left: 4px;
  color: #2692F0;
}

</style>
