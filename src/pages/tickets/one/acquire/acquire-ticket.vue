<template>
  <scroll-view class="page acquire-ticket">
    <div class="container">
      <meeting-card v-if="meeting"  :meeting="meeting" />
      <div v-if="ticket" class="section-single-line">
        <div class="flex aligned text warning">
          {{buyer && buyer.name}}送您 {{ticket.gradeType}}1张，价值 <cash :amount="ticket.price" /> 元
        </div>
      </div>
    </div>
    <provider-form
      name="buyer-info"
      class-name="participant-form container"
      show-required-column
      no-left-padding
      :values="participant"
      :onChange="onParticipantChange"
    >
      <div class="section">
        <div class="title">报名信息</div>
      </div>
      <div class="participant-fields section">
        <text-field
          name="phone"
          label="手机号"
          placeholder="请输入您的手机号"
          auto-focus
          required
          confirm-type="next"
          :disabled="currentUser.id"
        />
        <text-field
          v-if="!currentUser.id"
          name="smsCode"
          label="验证码"
          placeholder="请输入短信验证码"
          required
          confirm-type="next"
        >
          <template slot="right">
            <error-message message="验证码错误" :show="showErrorMessage" />
            <sms-code-button :phone="participant.phone" />
          </template>
        </text-field>
        <text-field
          name="name"
          label="姓名"
          placeholder="请输入您的真实姓名"
          required
        />
        <text-field
          name="company"
          label="公司"
          placeholder="请输入您的公司名称"
          required
        />
        <text-field
          name="email"
          label="邮箱"
          placeholder="请输入您的邮箱地址"
          required
        />
        <text-field
          name="position"
          label="职位"
          placeholder="请输入您的职位名称"
          required
        />
        <text-field
          name="city"
          label="城市"
          placeholder="请输入您所在的城市"
          required
          confirm-type="done"
        />
      </div>
    </provider-form>
    <div class="footer">
      <button
        class="large"
        @click="onSubmit"
        :disabled="!isFormValid"
      >
        立刻领取
      </button>
    </div>
  </scroll-view>
</template>
<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';

import MeetingCard from '@/components/MeetingCard';
import SmsCodeButton from '@/components/SmsCodeButton';
import ProviderForm from '@/modules/ProviderForm';
import TextField from '@/modules/TextField';
import Cash from '@/modules/Cash';

import goToTicketView from '@/pages/tickets/one/goToTicketView';
import registerUser from '@/methods/registerUser';
import updateUser from '@/methods/updateUser';
import getTicket from '@/methods/getTicket';
import acquireTicket from '@/methods/acquireTicket';
import isEmail from '@/utils/isEmail';
import toCash from '@/utils/filters/cash';
import openModal from '@/utils/modal';

import promptAcquireFail from './promptAcquireFail';

const promptAcquireSucceed = ({ ticket, user }) => openModal({
  confirmText: '查看门票',
  content: `已成功领取价值${toCash(ticket.price)}元的贵宾票\n` +
  `门票信息已经发送至${user.phone}`,
  onConfirm: () => goToTicketView(ticket.id),
});

export default {
  data() {
    return {
      ticket: null,
      participantInForm: {},
      invalidSmsCode: null,
    };
  },
  computed: {
    participant() {
      return {
        ...this.currentUser,
        ...this.participantInForm,
      };
    },
    userInfo() {
      return _.pick(this.currentUser, [
        'phone',
        'name',
        'company',
        'email',
        'city',
        'position',
      ]);
    },
    meeting() {
      return this.ticket && this.ticket.meeting;
    },
    buyer() {
      return this.ticket && this.ticket.buyer;
    },
    isPhoneValid() {
      return this.participant.phone && this.participant.phone.length === 11;
    },
    isSmsCodeValid() {
      const smsCode = this.participant.smsCode;
      return smsCode && smsCode.length === 6 && smsCode !== this.invalidSmsCode;
    },
    isFormValid() {
      if (!this.currentUser.id && !this.isSmsCodeValid) return false;

      return this.isPhoneValid &&
        this.participant.name &&
        this.participant.company &&
        this.participant.position &&
        this.participant.city &&
        isEmail(this.participant.email);
    },
    showErrorMessage() {
      return this.invalidSmsCode && this.invalidSmsCode === this.participant.smsCode;
    },
    ...mapGetters(['currentUser']),
  },
  methods: {
    onParticipantChange(values) {
      this.participantInForm = { ...this.participantInForm, ...values };
    },
    async onSubmit() {
      let user = this.currentUser;

      if (!user.id) {
        const credentials = {
          type: 'smsCode',
          ...this.participant,
        };
        user = await registerUser(credentials);
        this.$store.commit('setCurrentUser', user);
      } else if (!_.isEqual(this.participantInForm, this.userInfo)) {
        updateUser({
          id: this.currentUser.id,
          ...this.participantInForm,
        });
      }

      try {
        await acquireTicket({
          id: this.ticket.id,
          participantId: user.id,
        });
        promptAcquireSucceed({
          ticket: this.ticket,
          user,
        });
      } catch (e) {
        if (e.statusCode === 409) {
          promptAcquireFail(this.ticket.meetingId, {
            content: '您已经拥有一张此会议的门票',
          });
        } else {
          promptAcquireFail(this.ticket.meetingId);
        }
      }
    },
  },
  components: {
    MeetingCard,
    SmsCodeButton,
    Cash,
    ProviderForm,
    TextField,
  },
  async onShow() {
    const ticketId = this.$root.$mp.query.id || 1076;
    const meetingId = this.$root.$mp.query.meetingId || 1076;

    try {
      this.ticket = await getTicket(ticketId);
    } catch (e) {
      if (e.statusCode === 403 || e.statusCode === 410) {
        goToTicketView(ticketId, { meetingId });
      } else {
        promptAcquireFail(meetingId, {
          title: '门票获取失败',
          content: '未知网络错误, 可能是购票人被删除',
        });
        console.error('get ticket fail', e);
      }
    }

    this.participantInForm = { ...this.userInfo };
  },
};
</script>

<style lang="less">
.acquire-ticket {

  .field-name {
    min-width: 40px;
  }

  .sms-code-button {
    margin-right: 15px;
  }
}
</style>
