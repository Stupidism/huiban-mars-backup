<template>
  <scroll-view class="page acquire-ticket page-with-footer" :class="{'page-iphonex': isIphonex}">
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
          type="number"
          placeholder="方便发送门票详情"
          auto-focus
          required
          confirm-type="next"
          :disabled="currentUser.id"
        />
        <text-field
          v-if="!currentUser.id"
          name="smsCode"
          type="number"
          label="验证码"
          placeholder="6位数字"
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
          placeholder="现场签到必备信息"
          required
          confirm-type="next"
        />
        <text-field
          name="email"
          label="邮箱"
          placeholder="双重保障，确保您可以接收到活动信息"
          confirm-type="next"
        />
        <text-field
          name="city"
          label="城市"
          placeholder="补充信息，以便我们可以更好地服务您"
          confirm-type="next"
        />
        <text-field
          name="company"
          label="公司"
          placeholder="补充信息，以便我们可以更好地服务您"
          confirm-type="next"
        />
        <text-field
          name="position"
          label="职位"
          placeholder="补充信息，以便我们可以更好地服务您"
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
import { mapGetters, mapState } from 'vuex';

import MeetingCard from '@/components/MeetingCard';
import SmsCodeButton from '@/components/SmsCodeButton';
import ProviderForm from '@/modules/ProviderForm';
import TextField from '@/modules/TextField';
import Cash from '@/modules/Cash';

import goToTicketView from '@/pages/tickets/one/goToTicketView';
import { isAuthing, waitForAuth } from '@/methods/auth';
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
  onConfirm: () => goToTicketView({
    id: ticket.id,
  }),
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
        (!this.participant.email || isEmail(this.participant.email));
    },
    showErrorMessage() {
      return this.invalidSmsCode && this.invalidSmsCode === this.participant.smsCode;
    },
    ...mapState('runtime', ['isIphonex']),
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
  beforeMount() {
    this.participantInForm = {
      ...this.participantInForm,
      ...this.userInfo,
    };
  },
  async onShow() {
    if (isAuthing()) {
      await waitForAuth();
    }

    const ticketId = this.$root.$mp.query.id || 1311;
    const meetingId = this.$root.$mp.query.meetingId || 4;

    try {
      this.ticket = await getTicket(ticketId);
    } catch (e) {
      if (e.statusCode === 403) {
        promptAcquireFail(meetingId, {
          content: '您已经拥有一张此会议的门票',
        });
      } else if (e.statusCode === 410) {
        promptAcquireFail(meetingId);
      } else {
        promptAcquireFail(meetingId, {
          title: '门票获取失败',
          content: '未知网络错误, 可能是购票人被删除',
        });
        console.error('get ticket fail', e);
      }
    }
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

  .participant-fields {
    padding-top: 0;
    padding-bottom: 0;

    .text-field:last-child {
      border-bottom: none;
    }
  }
}
</style>
