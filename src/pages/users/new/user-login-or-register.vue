<template>
  <scroll-view class="user-login-or-register">
    <provider-form
      class-name="user-form"
      :values="credentials"
      :onChange="onCredentialsChange"
    >
      <image class="logo" src="/static/app-logo.png" />
      <text-field
        name="phone"
        placeholder="请输入手机号"
        auto-focus
        required
        confirm-type="next"
      >
        <template slot="left">
          <image class="icon small" src="/static/icons/user.svg" />
        </template>
      </text-field>
      <text-field
        name="smsCode"
        placeholder="短信验证码"
        required
        confirm-type="next"
      >
        <template slot="left">
          <image class="icon small" src="/static/icons/sms.svg" />
        </template>
        <template slot="right">
          <error-message message="验证码错误" :show="showErrorMessage" />
          <sms-code-button :phone="credentials.phone" />
        </template>
      </text-field>
      <button
        class="primary login-button"
        :disabled="!isFormValid"
        @click="onLoginClick"
        :loading="loading"
      >
        登录
      </button>
    </provider-form>
  </scroll-view>
</template>

<script>
import { mapGetters } from 'vuex';
import SmsCodeButton from '@/components/SmsCodeButton';
import ProviderForm from '@/modules/ProviderForm';
import TextField from '@/modules/TextField';
import ErrorMessage from '@/modules/ErrorMessage';

import registerUser from '@/methods/registerUser';
import goToPersonalCenter from '@/pages/users/me/goToPersonalCenter';

export default {
  data() {
    return {
      loading: false,
      credentials: {
        type: 'smsCode',
        phone: '',
        smsCode: '',
      },
      invalidSmsCode: null,
      query: {},
    };
  },
  computed: {
    isPhoneValid() {
      return this.credentials.phone.length === 11;
    },
    isSmsCodeValid() {
      const smsCode = this.credentials.smsCode;
      return smsCode.length === 6 && smsCode !== this.invalidSmsCode;
    },
    isFormValid() {
      return this.isPhoneValid && this.isSmsCodeValid;
    },
    showErrorMessage() {
      return this.invalidSmsCode && this.invalidSmsCode === this.credentials.smsCode;
    },
    ...mapGetters(['currentUser']),
  },
  methods: {
    onCredentialsChange(newCreadentials) {
      this.credentials = { ...this.credentials, ...newCreadentials };
    },
    async onLoginClick() {
      const credentials = {
        type: 'smsCode',
        ...this.credentials,
      };
      this.loading = true;
      try {
        const user = await registerUser(credentials);
        this.$store.commit('setCurrentUser', user);
        if (this.query.nextTab) {
          wx.switchTab({
            url: decodeURIComponent(this.query.nextTab),
          });
        }
        if (this.query.nextPage) {
          wx.redirectTo({
            url: decodeURIComponent(this.query.nextPage),
          });
        }
      } catch (e) {
        this.invalidSmsCode = credentials.smsCode;
      }
      this.loading = false;
    },
  },
  components: {
    ProviderForm,
    TextField,
    SmsCodeButton,
    ErrorMessage,
  },
  onShow() {
    this.query = this.$root.$mp.query;
    if (this.currentUser && this.currentUser.id) {
      goToPersonalCenter();
    }
  },
};
</script>

<style lang="less">
.user-login-or-register {
  height: 100vh;
  background: white;

  .user-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px;
    font-size: 16px;
  }

  .logo {
    margin: 80px 0;
    width: 60px;
    height: 60px;
  }

  .text-field {
    margin-top: 7.5px;

    input{
      margin: 20px 10px;
    }

    .sms-code-button {
      margin-left: 10px;
    }
  }

  .login-button {
    margin-top: 80px;
    width: 100%;
    font-size: 14px;
  }
}
</style>
