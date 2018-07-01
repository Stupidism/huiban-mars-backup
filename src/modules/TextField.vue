<template>
  <label class="text-field" :class="{'no-left-padding': noLeftPadding}">
    <span v-if="showRequiredColumn" class="required-marker">*</span>
    <span v-if="label" class="field-name">{{label}}</span>
    <slot name="left"></slot>
    <input
      type="text"
      :value="value"
      @input="onChange"
      @focus="onFocus"
      @blur="onBlur"
      :placeholder="placeholder"
      confirm-type="next"
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
  },
  data() {
    return {
      ownValue: this.defaultValue,
      meta: {
        touched: false,
        focused: false,
        errorMessage: null,
      },
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
      updateFields: 'updateFields',
      showRequiredColumn: 'showRequiredColumn',
      noLeftPadding: 'noLeftPadding',
      onFieldFocus: 'onFieldFocus',
      onFieldBlur: 'onFieldBlur',
    };
  },
  methods: {
    onChange(event) {
      const value = event.target.value;
      this.ownValue = value;
      setTimeout(() => this.updateFields({ [this.name]: value }));
    },
    onFocus() {
      this.meta.focused = true;
      this.meta.touched = true;
    },
    onBlur() {
      this.meta.focused = false;
    },
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
