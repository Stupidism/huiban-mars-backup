<template>
  <scroll-view class="page">
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

    <div
      v-if="selectedTicketGrade != null"
      class="amount-btn-group weui-footer weui-footer_fixed-bottom"
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

    <submit-footer :onSubmit="startOrder" :disabled="!sumPrice">
      合计: {{sumPriceInCash}} 元
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

import MeetingCard from '@/components/MeetingCard';
import TicketGrade from '@/components/TicketGrade';
import SubmitFooter from '@/components/SubmitFooter';
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
    MeetingCard,
    TicketGrade,
    Divider,
    SubmitFooter,
  },
  mixins: [getMeeting],
  async mounted() {
    wx.setNavigationBarTitle({
      title: '活动购票',
    });
    await this.getMeeting(this.$root.$mp.query.id || 1);

    // Mock navigate to new-order page
    this.selectedAmount = 2;
    this.selectedTicketGrade = this.meeting.ticketGrades[0];
    this.startOrder();
    // TODO: remove mock code above
  },
};
</script>

<style scoped>
.ticket-grades-radio {
  padding-top: 10px;
}

.ticket-grades-title {
  padding: 10px 0;
}

.amount-btn-group {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  background: white;
  border-top: 1px #bbb solid;

  font-weight: bolder;
  padding: 15px;
  bottom: 48px;
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
