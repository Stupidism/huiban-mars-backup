<template>
  <scroll-view class="page page-with-footer new-order">
    <div class="container">
      <div class="section-no-padding">
        <meeting-card :meeting="meeting" hide-status />
      </div>
      <div class="order-item-summary section">
        <span class="ticket-grade-summary">
          <image class="icon small ticket-grade-icon" :src="ticketGradeIcon" />
          票档：{{ticketGrade.type}} <span class="price"><cash :amount="ticketGrade.price" /></span> 元/张
        </span>
        <span class="amount">x {{amount}}张</span>
      </div>
    </div>
    <provider-form
      name="buyer-info"
      class-name="buyer-form container"
      show-required-column
      no-left-padding
    >
      <div class="section">
        <div class="title">购票人信息</div>
        <div class="sub-title">多人参会请在支付完成后邀请他人填写信息，以便现场签到</div>
      </div>
      <div class="buyer-fields section">
        <text-field
          name="name"
          label="姓名"
          placeholder="请输入您的真实姓名"
          auto-focus
          required
          confirm-type="next"
        />
        <text-field
          name="company"
          label="公司"
          placeholder="请输入您的公司名称"
          auto-focus
          required
          confirm-type="next"
        />
        <text-field
          name="position"
          label="职位"
          placeholder="请输入您的职位名称"
          auto-focus
          required
          confirm-type="next"
        />
        <text-field
          name="city"
          label="城市"
          placeholder="请输入您所在的城市"
          auto-focus
          required
          confirm-type="next"
        />
        <label class="form-field is-participant-checkbox">
          本人参会，上述信息将作为您现场签到的唯一凭证
          <input type="checkbox" v-model="buyer.isParticipant">
        </label>
      </div>
    </provider-form>
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
    <div class="footer">
      <div class="section flex aligned">
        合计：
        <span class="sum-price-amount"><cash :amount="sumPrice" /> </span>
        <span class="sum-price-unit">元</span>
      </div>
      <button class="primary large narrow" @click="onSubmit">支付</button>
    </div>
  </scroll-view>
</template>

<script>
import _ from 'lodash';

import MeetingCard from '@/components/MeetingCard';
import PaymentMethod from '@/components/PaymentMethod';
import ProviderForm from '@/modules/ProviderForm';
import TextField from '@/modules/TextField';
import Cash from '@/modules/Cash';

import getMeeting from '@/methods/getMeeting';
import getPaymentMethods from '@/methods/getPaymentMethods';
import postOrder from '@/methods/postOrder';
import payTransactionForOrder from '@/methods/payTransactionForOrder';

export default {
  data() {
    return {
      meeting: {
        ticketGrades: [],
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
      amount: 0,
      ticketGrade: {},
    };
  },
  computed: {
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
    sumPrice() {
      if (!this.ticketGrade || !this.amount) return 0;
      return this.ticketGrade.price * this.amount;
    },
  },
  methods: {
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
    selectePaymentMethod(paymentMethod) {
      if (this.selectedPaymentMethod === paymentMethod) {
        this.selectedPaymentMethod = null;
      } else {
        this.selectedPaymentMethod = paymentMethod;
      }
    },
    async onSubmit() {
      try {
        const order = await postOrder(this.order);
        payTransactionForOrder(order);
      } catch (e) {
        if (e.statusCode === 400 && e.data.type === 'No Stock') {
          this.promptNoStock();
        } else {
          throw e;
        }
      }
    },
  },
  components: {
    MeetingCard,
    PaymentMethod,
    ProviderForm,
    TextField,
    Cash,
  },
  async mounted() {
    const query = this.$root.$mp.query;
    this.meeting = await getMeeting(query.meetingId || 1);
    this.amount = Number(query.amount);
    this.ticketGrade = _.find(this.meeting.ticketGrades, ['id', Number(query.ticketGradeId)]);
    this.paymentMethods = await getPaymentMethods();
    this.selectedPaymentMethod = this.paymentMethods[0];
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

.sum-price-amount {
  font-size: 20px;
  color: #2692F0;
}

.sum-price-unit {
  margin-left: 4px;
  color: #2692F0;
}
</style>
