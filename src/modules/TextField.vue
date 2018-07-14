<template>
  <label class="text-field" :class="{'no-left-padding': noLeftPadding}">
    <span v-if="showRequiredColumn" class="required-marker">*</span>
    <span v-if="label" class="field-name">{{label}}</span>
    <slot name="left"></slot>
    <input
      type="text"
      :value="value"
      :focus="focused"
      @input="onChange"
      @click="onFocus"
      @blur="onBlur"
      :placeholder="placeholder"
      @confirm="onConfirm"
      :confirm-type="confirmType"
      :disabled="disabled"
    >
    <span v-if="!meta.focused && errorMessage" class="error-message">{{errorMessage}}</span>
    <slot name="right"></slot>
  </label>
</template>
<script>
import { consumer } from '@/mixins/context';
import isEmail from '@/utils/isEmail';

export default {
  props: {
    name: String,
    placeholder: String,
    label: String,
    type: {
      type: String,
      default: 'text',
    },
    defaultValue: String,
    required: Boolean,
    disabled: Boolean,
    confirmType: {
      type: String,
      default: 'next',
    },
  },
  data() {
    return {
      ownValue: this.defaultValue,
      ownMeta: {},
      lockBlurUntil: 0,
    };
  },
  mixins: [
    consumer,
  ],
  computed: {
    fieldValue() {
      return this.fields[this.name];
    },
    value() {
      return this.ownValue === undefined ? this.fieldValue : this.ownValue;
    },
    meta() {
      return this.metas[this.name] || {};
    },
    focused() {
      return this.controlFocusStatus ? this.meta.focused : this.ownMeta.focused;
    },
    errorMessage() {
      const meta = this.meta;
      if (!meta.touched) {
        return '';
      }
      if (this.required && !this.value) {
        return '不能为空';
      }
      if (this.type === 'email' && !isEmail(this.value)) {
        return '格式有误';
      }
      return '';
    },
  },
  consume() {
    return {
      formName: 'formName',
      fields: 'fields',
      metas: 'metas',
      registerField: 'registerField',
      updateFields: 'updateFields',
      updateMetas: 'updateMetas',
      showRequiredColumn: 'showRequiredColumn',
      noLeftPadding: 'noLeftPadding',
      onFieldFocus: 'onFieldFocus',
      onFieldBlur: 'onFieldBlur',
      onNextField: 'onNextField',
      controlFocusStatus: 'controlFocusStatus',
    };
  },
  methods: {
    onChange(event) {
      const value = event.target.value;
      this.ownValue = value;
      setTimeout(() => this.updateFields({ [this.name]: value }));
    },
    onFocus() {
      this.ownMeta.focused = true;
      if (this.meta.focused) return;
      this.onFieldFocus(this.name);
      this.lockBlurUntil = Date.now() + 100;
    },
    onBlur() {
      this.ownMeta.focused = false;
      if (!this.meta.focused || Date.now() < this.lockBlurUntil) return;
      this.onFieldBlur(this.name);
    },
    onConfirm() {
      this.ownMeta.focused = false;
      this.onNextField(this.confirmType);
      if (this.confirmType === 'done') {
        setTimeout(wx.hideKeyboard, 700);
      }
    },
  },
  mounted() {
    this.registerField(this.name);
  },
};
</script>
<style lang="less">
.text-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: solid 0.5px #EAEAEA;
  width: 100%;

  &.no-left-padding {
    padding-left: 0;
  }

  .required-marker {
    color: #FF2B00;
  }

  .error-message {
    margin-right: 15px;
    color: #FF2B00;
  }

  .field-name {
    &:not(:first-child) {
      margin-left: 12px;
    }
  }

  input[type=text] {
    margin: 15px;
    flex: 1;
  }

  input[disabled] {
    color: #C4C8CC;
  }
}
</style>
