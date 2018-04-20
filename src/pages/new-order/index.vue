<template>
  <scroll-view class="page new-order">
    <div class="container">
      <meeting-card :meeting="meeting" />
      <div class="order-item-summary section">
        <span class="ticket-grade-summary">
          <image class="icon small ticket-grade-icon" :src="ticketGradeIcon" />
          票档：{{ticketGrade.type}} <span class="price">{{priceInCash}}</span> 元/张
        </span>
        <span class="amount">x {{amount}}张</span>
      </div>
    </div>
    <div class="buyer-form container">
      <div class="section">
        <div class="title">购票人信息</div>
        <div class="sub-title">多人参会请在支付完成后邀请他人填写信息，以便现场签到</div>
      </div>

      <div class="buyer-fields section">
        <label class="form-field">
          <span class="required-marker">*</span>
          <span class="field-name">姓名</span>
          <input
            type="text"
            v-model="buyer.name"
            placeholder="请输入您的真实姓名"
            auto-focus
            confirm-type="next"
          >
        </label>
        <label class="form-field">
          <span class="required-marker">*</span>
          <span class="field-name">公司</span>
          <input
            type="text"
            v-model="buyer.company"
            placeholder="请输入您的公司名称"
            confirm-type="next"
          >
        </label>
        <label class="form-field">
          <span class="required-marker">*</span>
          <span class="field-name">职位</span>
          <input
            type="text"
            v-model="buyer.position"
            placeholder="请输入您的职位名称"
            confirm-type="next"
          >
        </label>
        <label class="form-field">
          <span class="required-marker">*</span>
          <span class="field-name">城市</span>
          <input
            type="text"
            v-model="buyer.city"
            placeholder="请输入您所在的城市"
          >
        </label>
        <label class="form-field is-participant-checkbox">
          本人参会，上述信息将作为您现场签到的唯一凭证
          <input type="checkbox" v-model="buyer.isParticipant">
        </label>
      </div>
    </div>
    <div class="container">
      <div class="title section">
        支付方式<span class="sub-title">（不支持无条件退款）</span>
      </div>
      <payment-method
        v-for="paymentMethod in paymentMethods"
        :key="paymentMethod.id"
        :paymentMethod="paymentMethod"
        :selected="paymentMethod === selectedPaymentMethod"
        @select="selectePaymentMethod(paymentMethod)"
      />
    </div>
    <submit-footer buttonName="支付" :onSubmit="onSubmit" primary>
      <div class="sum-price">
        合计：
        <span class="sum-price-amount">{{sumPriceInCash}} </span>
        <span class="sum-price-unit">元</span>
      </div>
    </submit-footer>
  </scroll-view>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import MeetingCard from '@/components/MeetingCard';
import PaymentMethod from '@/components/PaymentMethod';
import SubmitFooter from '@/components/SubmitFooter';

import getMeeting from '@/mixins/get-meeting';
import payOrder from '@/mixins/pay-order';

import { wxRequest, paymentMethodList, orderPost } from '@/apis';
import { example as paymentMethodsExample } from '@/apis/payment_methods/list';

const { mapState, mapGetters } = createNamespacedHelpers('orderItem');

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
    ...mapState(['amount', 'ticketGrade']),
    ...mapGetters(['priceInCash', 'sumPriceInCash']),
    ticketGradeIcon() {
      return `/static/icons/ticket-grade/${this.ticketGrade.typeColor || 'blue'}.png`;
    },
    order() {
      return {
        meetingId: this.meeting.id,
        items: [{
          ticketGradeId: this.ticketGrade.id,
          ticketAmount: this.amount,
          ticketPrice: this.ticketGrade.price,
          meetingId: this.meeting.id,
        }],
        paymentMethodId: this.selectedPaymentMethod ? this.selectedPaymentMethod.id : '',
      };
    },
  },
  methods: {
    async getPaymentMethods() {
      try {
        this.paymentMethods = await wxRequest(paymentMethodList());
      } catch (e) {
        if (e.errMsg === 'request:fail url not in domain list' || e.statusCode === 404) {
          this.paymentMethods = paymentMethodsExample;
        } else {
          console.error(e.statusCode, e.data);
          throw e;
        }
      }
    },
    promptNoStock() {
      wx.showModal({
        content: '门票被抢完啦，下次赶早哟',
        cancelText: '知道了',
        cancelColor: '#000000',
        confirmText: '重新选票',
        confirmColor: '#2692F0',
        success(res) {
          if (res.confirm) {
            wx.navigateBack();
          }
        },
      });
    },
    async postOrder() {
      try {
        return await wxRequest(orderPost(this.order));
      } catch (e) {
        if (e.errMsg === 'request:fail url not in domain list') {
          return {};
        }
        if (e.statusCode === 400 && e.data.type === 'No Stock') {
          return this.promptNoStock();
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
      this.payOrder(order);
    },
  },
  mixins: [getMeeting, payOrder],
  components: { MeetingCard, PaymentMethod, SubmitFooter },
  async mounted() {
    wx.setNavigationBarTitle({
      title: '订单确认及支付',
    });
    this.getMeeting(this.$root.$mp.query.meeting || 1);
    await this.getPaymentMethods();
    this.selectedPaymentMethod = this.paymentMethods[0];

    this.promptNoStock();
    // Mock navigate to new-order page
    // this.onPaymentSucess({ id: 1 });
    // TODO: remove mock code above
  },
};
</script>

<style scoped lang="less">
.order-item-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 15px 12px;

  .price {
    color: #2692F0;
  }

  .amount {
    .price();

    font-size: 12px;
  }

  .ticket-grade-summary {
    display: flex;
    align-items: center;
  }

  .ticket-grade-icon {
    margin-right: 10px;
  }
}

.buyer-form {
  .buyer-fields {
    padding: 0 0 0 15px;
  }

  .form-field {
    display: flex;
    align-items: center;
    font-size: 14px;
    padding: 15px 15px 15px 0;
    border-bottom: solid 0.5px #EAEAEA;

    .field-name {
      &:not(:first-child) {
        margin-left: 12px;
      }
    }

    .required-marker {
      color: red;
    }

    input[type=text] {
      margin-left: 20px;
      flex: 1;
    }

    &.is-participant-checkbox {
      font-size: 12px;
      line-height: 20px;
      justify-content: space-between;
      border-bottom: 0;

      checkbox {
        margin-top: -3px;
        margin-right: -6px;
        transform: scale(0.7);
      }
    }
  }
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
