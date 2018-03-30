<template>
  <scroll-view class="page meeting-buy">
    <meeting-card :meeting="meeting" />

    <divider />

    <div class="ticket-grades-radio">
      <div class="ticket-grades-title">
        选择票档
        <span class="helper-text">（贵宾票不参与买一赠一活动）</span>
      </div>
      <div>
        <ticket-grade
          v-for="ticketGrade in meeting.ticketGrades"
          :key="ticketGrade.id"
          :ticket-grade="ticketGrade"
          :selected="ticketGrade === selectedTicketGrade"
          @select="selectTicketGrade(ticketGrade)"
        />
      </div>
    </div>

    <div class="footer weui-footer weui-footer_fixed-bottom">
      <div
        v-if="selectedTicketGrade != null"
        class="amount-btn-group footer-item weui-flex"
      >
        <span class="amount-btn-title">
          数量:
        </span>
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
      <div class="order-summary weui-flex footer-item">
        <span class="order-summary-content weui-flex">
          <span class="order-summary-sum">
            合计: {{sumPriceInCash}}
          </span>
          <span class="order-summary-notice">
            <navigator url="/page/order-notice" hover-class="navigator-hover">
              《购票须知》
            </navigator>
          </span>
        </span>
        <button class="order-btn" :disabled="!sumPrice" @click="startOrder">
          提交
        </button>
      </div>
    </div>
  </scroll-view>
</template>

<script>
import qs from 'query-string';

import getMeeting from '@/mixins/get-meeting';
import toCash from '@/utils/filters/cash';

import MeetingCard from '@/components/MeetingCard';
import TicketGrade from '@/components/TicketGrade';
import Divider from '@/components/Divider';

export default {
  data() {
    return {
      meeting: {},
      selectedTicketGrade: null,
      selectedAmount: null,
    };
  },
  computed: {
    coverImg() {
      return this.meeting.coverImg;
    },
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
          ticketGrade: this.selectedTicketGrade,
        })}`,
      });
    },
  },
  components: {
    MeetingCard,
    TicketGrade,
    Divider,
  },
  mixins: [getMeeting],
  mounted() {
    wx.setNavigationBarTitle({
      title: '活动购票',
    });
    this.getMeeting(this.$root.$mp.query.id || 1);
  },
};
</script>

<style scoped>
.meeting-buy {
  padding: 0 10px 200px;
  width: auto;
}
.ticket-grades-radio {
  padding-top: 10px;
}

.ticket-grades-title {
  padding: 10px 0;
}

.footer {
  bottom: 0;
}

.footer-item {
  background: white;
  border-top: 1px #bbb solid;
}

.order-summary {
}

.order-summary-content {
  flex: 3;
  align-items: center;
  padding: 15px;
  justify-content: space-between;
}

.order-btn {
  flex: 2;
  border-radius: 0;
}

.amount-btn-group {
  font-weight: bolder;
  align-items: center;
  justify-content: flex-start;
  padding: 15px;
}

.amount-btn-title {
  margin-right: 30px;
  font-weight: bolder;
}

.amount-btn {
  height: 30px;
  width: 12%;
  border: 1px solid grey;
  margin-right: 5px;
  line-height: 30px;
}

.amount-btn.selected {
  background: #bbb;
}

</style>
