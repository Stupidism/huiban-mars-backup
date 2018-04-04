<template>
  <scroll-view class="page new-order">
    <meeting-card :meeting="meeting" mini="true" />
    <div class="ticket-grade-summary bordered weui-flex">
      <span>票档：{{ticketGrade.type}} {{price}} 元/张</span>
      <span>X {{amount}}</span>
    </div>
    <div class="divider" />
    <div class="buyer-form">
      <div class="title margined-vertical">
        购票人信息
        <div class="sub-title">（多人参会请在支付完成后邀请他人填写信息，以便现场签到）</div>
      </div>

      <div class="bordered">
        <label class="form-field">
          姓名：
          <input type="text" v-model="buyer.name" placeholder="必填，请输入您的真实姓名" auto-focus>
        </label>
        <label class="form-field">
          公司：
          <input type="text" v-model="buyer.company" placeholder="必填，请输入您的公司名称">
        </label>
        <label class="form-field">
          职位：
          <input type="text" v-model="buyer.position" placeholder="必填，请输入您的职位名称">
        </label>
        <label class="form-field">
          城市：
          <input type="text" v-model="buyer.city" placeholder="必填，请输入您所在的城市">
        </label>
      </div>
      <label class="form-field is-participant-checkbox">
        <input type="checkbox" v-model="buyer.isParticipant">
        本人参会，上述信息将作为您现场签到的唯一凭证
      </label>
    </div>
    <div class="divider" />
    <div class="payment-method-list">
      <div class="title">支付方式<span class="sub-title">（不支持无条件退款）</span></div>
      <payment-method
        v-for="paymentMethod in paymentMethods"
        :key="paymentMethod.id"
        :paymentMethod="paymentMethod"
        :selected="paymentMethod === selectedPaymentMethod"
        @select="selectePaymentMethod(paymentMethod)"
      />
    </div>
    <submit-footer buttonName="支付" :onSubmit="onSubmit">
      合计: {{sumPriceInCash}} 元
    </submit-footer>
  </scroll-view>
</template>

<script>
import _ from 'lodash';
import qs from 'query-string';

import getMeeting from '@/mixins/get-meeting';
import MeetingCard from '@/components/MeetingCard';
import PaymentMethod from '@/components/PaymentMethod';
import SubmitFooter from '@/components/SubmitFooter';

import { wxRequest, paymentMethodList, orderPost, transactionPost } from '@/apis';
import { example as paymentMethodsExample } from '@/apis/payment-methods/list';
import toCash from '@/utils/filters/cash';

export default {
  data() {
    return {
      meeting: {
        ticketGrades: []
      },
      buyer: {
        name: '',
        company: '',
        postion: '',
        city: '',
        isParticipant: false,
      },
      paymentMethods: [],
      selectedPaymentMethod: null,
    };
  },
  computed: {
    query() {
      return this.$root.$mp.query;
    },
    amount() {
      return this.query.amount ? Number(this.query.amount) : 1;
    },
    ticketGrade() {
      return _.find(this.meeting.ticketGrades, {
        type: this.query.ticketGrade || '早鸟票',
      }) || this.meeting.ticketGrades[0] || {};
    },
    price() {
      return toCash(this.ticketGrade.price);
    },
    sumPriceInCash() {
      return toCash(this.ticketGrade.price * this.amount);
    },
    order() {
      return {
        meetingId: this.meeting.id,
        items: [{
          ticketGrade: this.query.ticketGrade,
          ticketAmount: this.query.amount,
          ticketPrice: this.ticketGrade.price,
          meetingId: this.meeting.id,
        }],
        paymentMethodId: this.selectedPaymentMethod ? this.selectedPaymentMethod.id : '',
      };
    }
  },
  methods: {
    async getPaymentMethods() {
      try {
        this.paymentMethods = await wxRequest(paymentMethodList());
      } catch (e) {
        if (e.errMsg === 'request:fail url not in domain list') {
          this.paymentMethods = paymentMethodsExample;
        } else {
          console.error(e.statusCode, e.data);
          throw e;
        }
      }
    },
    async postOrder() {
      try {
        return await wxRequest(orderPost(this.order));
      } catch (e) {
        if (e.errMsg === 'request:fail url not in domain list') {
          return {};
        }
        console.error(e.statusCode, e.data);
        throw e;
      }
    },
    async postTransaction(order) {
      try {
        return await wxRequest(transactionPost(order.id));
      } catch (e) {
        if (e.errMsg === 'request:fail url not in domain list') {
          return {};
        }
        console.error(e.statusCode, e.data);
        throw e;
      }
    },
    selectePaymentMethod(paymentMethod) {
      if (this.selectedPaymentMethod === paymentMethod) {
        this.selectedPaymentMethod = null;
      } else {
        this.selectedPaymentMethod = paymentMethod;
      }
    },
    async onSubmit() {
      const order = await this.postOrder();
      const transaction = await this.postTransaction(order.id);
      this.startPay(transaction);
    },
    startPay() {
      console.log('startPay');
      wx.requestPayment({
        timeStamp: '',
        nonceStr: '',
        package: '',
        signType: 'MD5',
        paySign: '',
        success(res) {
          this.onPaymentSucess(res);
        },
        fail(res) {
          this.onPaymentFail(res);
        }
      });
    },
    onPaymentSucess(order) {
      wx.navigateTo({
        url: `./payment-result/main?${qs.stringify({
          order: order.id || 1,
        })}`,
      });
    },
    onPaymentFail(error) {
      console.error(error);
    },
  },
  mixins: [getMeeting],
  components: { MeetingCard, PaymentMethod, SubmitFooter },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '订单确认及支付',
    });
    this.getMeeting(this.$root.$mp.query.meeting || 1);
    await this.getPaymentMethods();
    this.selectedPaymentMethod = this.paymentMethods[0];

    // Mock navigate to new-order page
    this.onPaymentSucess({ id: 1 });
    // TODO: remove mock code above
  },
};
</script>

<style scoped>
.ticket-grade-summary {
  justify-content: space-between;
  margin-bottom: 15px;
}

.buyer-form {
  padding: 15px 0;
}

.form-field {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.form-field:not(:first-child) {
  margin-top: 10px;
}

.form-field input[type=text] {
  font-size: 12px;
  margin-left: 5px;
  flex: 1;
  border-bottom: 1px solid grey;
}

.form-field checkbox {
  margin-left: -3px;
  transform: scale(0.7);
}

.is-participant-checkbox {
  margin-top: 15px;
}

.payment-method-list {
  padding: 10px 0;
}

</style>
