<template>
  <scroll-view class="page">
    <meeting-banner :meeting="meeting" />

    <div class="ticket-grades-radio container">
      <div class="title section-single-line">
        <span>选择票档</span>
        <span class="sub-title">（贵宾票不参与买一赠一活动）</span>
      </div>

      <div class="ticket-grades section">
        <ticket-grade
          v-for="ticketGrade in meeting.ticketGrades"
          :key="ticketGrade.id"
          :ticket-grade="ticketGrade"
          :selected="ticketGrade.id === selectedTicketGrade.id"
          @select="setTicketGrade(ticketGrade)"
        />
      </div>
    </div>

    <div class="image-container">
      <image src="/static/coupons/buy-one-get-one-free.png" mode="widthFix" />
    </div>

    <div
      v-if="selectedTicketGrade.id != null"
      class="amount-radio container-single-section"
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
          @click="setAmount(amount)"
          v-if="selectedTicketGrade.restAmount >= amount"
        >
          {{amount}}
        </span>
      </div>
    </div>

    <div class="submit-footer content-horizontal">
      <div class="summary-content content-horizontal">
        <div class="sum-price">
          合计：
          <span class="sum-price-amount">{{sumPriceInCash}} </span>
          <span class="sum-price-unit">元</span>
        </div>
        <div @click="openTicketNotes" class="ticket-notes">
          《购票须知》
        </div>
      </div>
      <button class="submit-btn primary" :disabled="!sumPrice" @click="startOrder">
        提交
      </button>
    </div>

    <ticket-notes v-if="isTicketNotesOpen" :onClose="closeTicketNotes" />

  </scroll-view>
</template>

<script>
import qs from 'query-string';
import { createNamespacedHelpers } from 'vuex';

import getMeeting from '@/mixins/get-meeting';

import MeetingBanner from '@/components/MeetingBanner';
import TicketGrade from '@/components/TicketGrade';
import TicketNotes from '@/components/TicketNotes';

const { mapState, mapMutations, mapGetters } = createNamespacedHelpers('orderItem');

export default {
  data() {
    return {
      meeting: {},
      isTicketNotesOpen: false,
    };
  },
  computed: {
    ...mapState({
      selectedAmount: 'amount',
      selectedTicketGrade: 'ticketGrade',
    }),
    ...mapGetters(['sumPrice', 'sumPriceInCash']),
  },
  methods: {
    startOrder() {
      wx.navigateTo({
        url: `/pages/new-order/main?${qs.stringify({
          meeting: this.meeting.id,
        })}`,
      });
    },
    openTicketNotes() {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#666666',
      });
      this.isTicketNotesOpen = true;
    },
    closeTicketNotes() {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
      });
      this.isTicketNotesOpen = false;
    },
    ...mapMutations(['setAmount', 'setTicketGrade']),
  },
  components: {
    MeetingBanner,
    TicketGrade,
    TicketNotes,
  },
  mixins: [getMeeting],
  async mounted() {
    wx.setNavigationBarTitle({
      title: '选择票档',
    });
    await this.getMeeting(this.$root.$mp.query.id || 1);

    // Mock navigate to new-order page
    this.setAmount(2);
    this.setTicketGrade(this.meeting.ticketGrades[0]);
    this.startOrder();
    // TODO: remove mock code above
  },
};
</script>

<style scoped lang="less">
.ticket-grades-radio {
  .title {
    display: flex;
    align-items: baseline;
  }
}

.amount-radio {
  position: fixed;
  bottom: 50px;

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
