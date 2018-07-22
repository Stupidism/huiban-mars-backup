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
          type="email"
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
        class="pay-btn primary large narrow"
        @click="onSubmit"
        :disabled="paying || !isFormValid"
        :loading="paying"
      >
        {{order ? '支付' : '下单并支付'}}
      </button>
      <button
        v-else
        class="pay-btn primary large narrow"
        open-type="getPhoneNumber"
        @getphonenumber="onPhoneNumberGet"
        :disabled="gettingPhoneNumber || !isFormValid"
        :loading="gettingPhoneNumber"
      >
        下单并支付
      </button>
    </div>
  </scroll-view>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import buildUrl from 'build-url';

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
import updateUser from '@/methods/updateUser';
import { login } from '@/methods/auth';
import wechatLogin from '@/methods/wechat/login';

import goToUserLoginOrRegister from '@/pages/users/new/goToUserLoginOrRegister';
import isEmail from '@/utils/isEmail';
import openModal from '@/utils/modal';
import goToOrderDetail from '@/pages/orders/one/goToOrderDetail';

const promptOrderError = options => openModal({
  title: '下单失败, 原因:',
  content: '订单错误!',
  cancelText: '知道了',
  confirmText: '重新选票',
  onConfirm: wx.navigateBack,
  ...options,
});

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
      selfParticipate: true,
      paymentMethods: [],
      selectedPaymentMethod: {},
      amount: 0,
      ticketGrade: {},
      isAuthorized: false,
      paying: false,
      gettingPhoneNumber: false,
      order: null,
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
    userInfo() {
      return _.pick(this.currentUser, [
        'name',
        'company',
        'email',
        'city',
        'position',
      ]);
    },
    ...mapGetters(['currentUser']),
  },
  methods: {
    selectePaymentMethod(paymentMethod) {
      this.selectedPaymentMethod = paymentMethod;
    },
    async onPhoneNumberGet({ mp: { detail } }) {
      if (detail.errMsg === 'getPhoneNumber:ok') {
        this.gettingPhoneNumber = true;
        const wechatCode = await wechatLogin();
        const user = await registerUser({
          ...this.buyer,
          type: 'wechatPhoneNumber',
          encryptedData: detail.encryptedData,
          iv: detail.iv,
          wechatCode,
        });
        this.$store.commit('setCurrentUser', user);

        await login({
          type: 'wechat',
          wechatCode,
        });
        this.isAuthorized = true;
        this.gettingPhoneNumber = false;

        this.onSubmit();
      } else {
        goToUserLoginOrRegister({
          nextPage: buildUrl({
            path: '/pages/orders/new/main',
            queryParams: this.$root.$mp.query,
          }),
        });
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
      if (this.currentUser.id && !_.isEqual(this.buyer, this.userInfo)) {
        updateUser({
          id: this.currentUser.id,
          ...this.buyer,
        });
      }

      this.paying = true;
      try {
        if (!this.order) {
          this.order = await postOrder(this.buildOrder());
        }
        await payTransactionForOrder(this.order, {
          onCancelOrder: () => goToOrderDetail(this.order.id),
        });
      } catch (error) {
        if (error.statusCode === 400 && error.data.type === 'No Stock') {
          promptOrderError({
            content: '门票被抢完啦，下次赶早哟',
          });
        } else {
          promptOrderError({
            content: `发生未知错误: ${error.data.message}\n` +
              `type: ${error.data.type}\n` +
              `${JSON.stringify(error.data.errors)}`,
          });
          console.error('pay order fail', error);
        }
      }
      this.paying = false;
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
    this.buyer = this.userInfo;
  },
  async onShow() {
    const query = this.$root.$mp.query;
    this.meeting = await getMeeting(query.meetingId || 1);
    this.amount = Number(query.amount);
    this.ticketGrade = _.find(this.meeting.ticketGrades, ['id', Number(query.ticketGradeId)]);
    this.paymentMethods = await getPaymentMethods();
    this.selectedPaymentMethod = this.paymentMethods[0];

    // When navigate back from login page
    // this.currentUser is updated
    // but the dom tree is not
    // assign isAuthorized to update the payment button
    this.isAuthorized = !!this.currentUser.phone;
    this.order = null;
  },
};
</script>

<style scoped lang="less">
.new-order {
  .pay-btn {
    width: 120px;
  }
}

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
