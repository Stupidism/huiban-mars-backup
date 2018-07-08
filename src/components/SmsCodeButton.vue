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

export default {
  props: {
    phone: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      coolDown: 0,
    };
  },
  computed: {
    isPhoneValid() {
      return this.phone.length === 11;
    },
    isCoolingDown() {
      return this.coolDown > 0;
    },
  },
  methods: {
    onSendSmsCodeClick() {
      this.coolDown = 60;
      sendSmsCode({ phone: this.phone });
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
