<template>
  <button
    class="primary small sms-code-button"
    :disabled="!isPhoneValid || isCoolingDown"
    @click="onSendSmsCodeClick"
  >
    <span v-if="!isCoolingDown">获取验证码</span>
    <span v-else>
      重发(
      <count-down
        :num="coolDown"
        :onCountDown="onSmsCdCountDown"
      />
      s)
    </span>
  </button>
</template>

<script>
import CountDown from '@/modules/CountDown';
import sendSmsCode from '@/methods/sendSmsCode';
import isPhone from '@/utils/isPhone';

export default {
  props: {
    phone: {
      type: String,
      default: '',
    },
    onSmsCodeFail: Function,
  },
  data() {
    return {
      coolDown: 0,
    };
  },
  computed: {
    isPhoneValid() {
      return isPhone(this.phone);
    },
    isCoolingDown() {
      return this.coolDown > 0;
    },
  },
  methods: {
    async onSendSmsCodeClick() {
      this.coolDown = 60;
      try {
        await sendSmsCode(this.phone);
      } catch (e) {
        console.error('sendSmsCode', e);
        if (this.onSmsCodeFail) {
          this.onSmsCodeFail();
        }
      }
    },
    onSmsCdCountDown(leftNum) {
      if (leftNum < 0) {
        this.coolDown = 0;
      }
      return leftNum < 0;
    },
  },
  components: {
    CountDown,
  },
};
</script>

<style lang="less">
.sms-code-button {
  font-size: 12px;
}
</style>
