<template>
  <scroll-view class="page meeting-buy">
    <div class="meeting-intro weui-flex">
      <img class="meeting-cover weui-flex__item" src="/static/default-cover.png" alt="封面图片" />
      <div class="meeting-info weui-flex__item">
        <div class="meeting-topic">{{meeting.topic}}</div>
        <div class="meeting-info-centent">
          <div>
            时间: {{startAt}}
          </div>
          <div>
            地点: {{meeting.address}}
          </div>
          <div>
            发布方: {{meeting.host}}
          </div>
        </div>
      </div>
    </div>
    <div class="ticket-grades-radio">
      <div class="ticket-grades-title">
        选择票档
        <span class="ticket-grades-prompt">（贵宾票不参与买一赠一活动）</span>
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
import getMeeting, { example as meetingExample } from '@/apis/meetings/getOne';
import toDate from '@/utils/filters/date';
import toCash from '@/utils/filters/cash';

import TicketGrade from '../../components/TicketGrade';

export default {
  data() {
    return {
      meeting: null,
      selectedTicketGrade: null,
      selectedAmount: null,
    };
  },
  computed: {
    startAt() {
      return toDate(this.meeting.startAt);
    },
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
    getMeeting(id) {
      const request = getMeeting(id);
      this.meeting = meetingExample;
      return request;
    },
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
      console.log(this.selectedAmount, this.selectedTicketGrade);
    },
  },
  components: {
    TicketGrade,
  },
  created() {
    wx.setNavigationBarTitle({
      title: '活动购票',
    });

    this.getMeeting();
  },
};
</script>

<style scoped>
.meeting-buy {
  padding: 0 10px 200px;
  width: auto;
}

.meeting-intro {
  border-bottom: dashed 1px #bbb;
  padding-bottom: 15px;
}

.meeting-cover {
  flex: 1;
  height: 150px;
  margin-right: 15px;
}

.meeting-info {
  flex: 2;
}

.meeting-topic {
  font-weight: bolder;
  font-size: 16px;

  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  padding-right: 10px;
}

.meeting-info-centent {
  margin-top: 30px;
  font-size: 14px;
}

.ticket-grades-radio {
  padding-top: 10px;
}

.ticket-grades-title {
  padding: 10px 0;
}

.ticket-grades-prompt {
  font-size: 14px;
  color: grey;
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
