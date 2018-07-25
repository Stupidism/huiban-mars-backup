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
        type="number"
        auto-focus
        required
        placeholder="请输入手机号"
        confirm-type="next"
        :validators="phoneValidators"
      >
        <template slot="left">
          <image class="icon small" src="/static/icons/user.svg" />
        </template>
      </text-field>
      <text-field
        name="smsCode"
        type="number"
        required
        placeholder="请输入验证码"
        confirm-type="done"
        :validators="smsCodeValidators"
      >
        <template slot="left">
          <image class="icon small" src="/static/icons/sms.svg" />
        </template>
        <template slot="right">
          <sms-code-button :phone="credentials.phone" :onSmsCodeFail="onSmsCodeFail" />
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
    <navigator
      url="/pages/meetings/main"
      open-type="switchTab"
    >
      <div class="cancel-login">
        暂不登录 继续浏览
      </div>
    </navigator>
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
import isPhone from '@/utils/isPhone';
import isSmsCode from '@/utils/isSmsCode';
import phoneRegexValidator from '@/utils/validators/phoneRegexValidator';
import smsCodeRegexValidator from '@/utils/validators/smsCodeRegexValidator';

export default {
  data() {
    return {
      loading: false,
      credentials: {
        type: 'smsCode',
        phone: '',
        smsCode: '',
      },
      invalidCredentials: {
        phone: null,
        smsCode: null,
      },
      query: {},
    };
  },
  computed: {
    isFormValid() {
      return isPhone(this.credentials.phone) && isSmsCode(this.credentials.smsCode);
    },
    phoneValidators() {
      return [
        phoneRegexValidator,
        this.invalidPhoneValidator,
      ];
    },
    smsCodeValidators() {
      return [
        smsCodeRegexValidator,
        this.invalidSmsCodeValidator,
      ];
    },
    ...mapGetters(['currentUser']),
  },
  methods: {
    onCredentialsChange(newCreadentials) {
      this.credentials = { ...this.credentials, ...newCreadentials };
    },
    async onLoginClick() {
      this.invalidCredentials.phone = null;
      this.invalidCredentials.smsCode = null;
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
        console.error('[user-login] registerUser error', e);
        const res = e.data;
        if (res.type === 'Validation Error') {
          if (res.message === '手机号格式错误') {
            this.invalidCredentials.phone = this.credentials.phone;
          } else if (res.message === '无效的验证码') {
            this.invalidCredentials.smsCode = this.credentials.smsCode;
          }
        }
      }
      this.loading = false;
    },
    onSmsCodeFail() {
      this.invalidCredentials.phone = this.credentials.phone;
    },
    invalidPhoneValidator(phone) {
      if (phone !== this.invalidCredentials.phone) return '';
      return '手机号格式错误';
    },
    invalidSmsCodeValidator(smsCode) {
      if (smsCode !== this.invalidCredentials.smsCode) return '';
      return '无效的验证码';
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

  .cancel-login {
    color: #39f;
    font-size: 14px;
    line-height: 16px;
    text-align: center;
    text-decoration: underline;
  }
}
</style>
