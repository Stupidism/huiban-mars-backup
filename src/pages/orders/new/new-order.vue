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
      :values="buyer"
      :onChange="onBuyerChange"
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
          required
          confirm-type="next"
        />
        <text-field
          name="email"
          label="邮箱"
          placeholder="请输入您的邮箱地址"
          required
          confirm-type="next"
        />
        <text-field
          name="position"
          label="职位"
          placeholder="请输入您的职位名称"
          required
          confirm-type="next"
        />
        <text-field
          name="city"
          label="城市"
          placeholder="请输入您所在的城市"
          required
          confirm-type="next"
        />
        <label class="form-field is-participant-checkbox" @click="toggleSelfParticipate">
          本人参会，上述信息将作为您现场签到的唯一凭证
          <image v-if="selfParticipate" class="icon" src="/static/icons/check-rect.png" />
          <image v-else class="icon" src="/static/icons/check-rect-unchecked.png" />
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
      <button
        v-if="isAuthorized"
        class="primary large narrow"
        @click="onSubmit"
        :disabled="!isFormValid"
      >
        支付
      </button>
      <button
        v-else
        class="primary large narrow"
        open-type="getPhoneNumber"
        @getphonenumber="onPhoneNumberGet"
        :disabled="!isFormValid"
      >
        获取手机号
      </button>
    </div>
  </scroll-view>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

import MeetingCard from '@/components/MeetingCard';
import PaymentMethod from '@/components/PaymentMethod';
import ProviderForm from '@/modules/ProviderForm';
import TextField from '@/modules/TextField';
import Cash from '@/modules/Cash';

import getMeeting from '@/methods/getMeeting';
import getPaymentMethods from '@/methods/getPaymentMethods';
import postOrder from '@/methods/postOrder';
import payTransactionForOrder from '@/methods/payTransactionForOrder';
import registerUser from '@/methods/registerUser';

import goToUserLoginOrRegister from '@/pages/users/new/goToUserLoginOrRegister';
import isEmail from '@/utils/isEmail';

export default {
  data() {
    return {
      meeting: {
        ticketGrades: [],
      },
      buyer: {
        name: '',
        company: '',
        position: '',
        email: '',
        city: '',
      },
      selfParticipate: false,
      paymentMethods: [],
      selectedPaymentMethod: {},
      amount: 0,
      ticketGrade: {},
      isAuthorized: false,
    };
  },
  computed: {
    ticketGradeIcon() {
      return `/static/icons/ticket-grade/${this.ticketGrade.typeColor || 'blue'}.png`;
    },
    sumPrice() {
      if (!this.ticketGrade || !this.amount) return 0;
      return this.ticketGrade.price * this.amount;
    },
    isFormValid() {
      return this.buyer.name &&
        this.buyer.company &&
        this.buyer.position &&
        this.buyer.city &&
        isEmail(this.buyer.email);
    },
    ...mapGetters(['currentUser']),
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
    promptUnknownError(error) {
      wx.showModal({
        content: `发生未知错误: ${error.data.message}\n` +
          `type: ${error.data.type}\n` +
          `${JSON.stringify(error.data.errors)}`,
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
      this.selectedPaymentMethod = paymentMethod;
    },
    async onPhoneNumberGet({ mp: { detail } }) {
      if (detail.errMsg === 'getPhoneNumber:ok') {
        const user = await registerUser({
          type: 'wechatPhoneNumber',
          encryptedData: detail.encryptedData,
          iv: detail.iv,
        });
        this.$store.commit('setCurrentUser', {
          id: -1,
          ...user,
        });
        this.isAuthorized = true;
        this.onSubmit();
      } else {
        goToUserLoginOrRegister();
      }
    },
    buildOrder() {
      return {
        meetingId: this.meeting.id,
        paymentMethodId: this.selectedPaymentMethod.id,
        items: [{
          ticketGradeId: this.ticketGrade.id,
          ticketAmount: this.amount,
          ticketPrice: this.ticketGrade.price,
          meetingId: this.meeting.id,
        }],
        selfParticipate: this.selfParticipate,
      };
    },
    onBuyerChange(values) {
      this.buyer = { ...this.buyer, ...values };
    },
    toggleSelfParticipate() {
      this.selfParticipate = !this.selfParticipate;
    },
    async onSubmit() {
      try {
        const order = await postOrder(this.buildOrder());
        payTransactionForOrder(order);
      } catch (error) {
        if (error.statusCode === 400 && error.data.type === 'No Stock') {
          this.promptNoStock();
        } else {
          this.promptUnknownError(error);
          throw error;
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
  beforeMount() {
    if (!_.isEmpty(this.currentUser)) {
      this.buyer = _.pick(this.currentUser, [
        'name',
        'company',
        'city',
        'position',
      ]);
    }
  },
  async mounted() {
    const query = this.$root.$mp.query;
    this.meeting = await getMeeting(query.meetingId || 1);
    this.amount = Number(query.amount);
    this.ticketGrade = _.find(this.meeting.ticketGrades, ['id', Number(query.ticketGradeId)]);
    this.paymentMethods = await getPaymentMethods();
    this.selectedPaymentMethod = this.paymentMethods[0];
  },
  onShow() {
    // When navigate back from login page
    // this.currentUser is updated
    // but the dom tree is not
    // assign isAuthorized to update the payment button
    this.isAuthorized = !!this.currentUser.id;
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
