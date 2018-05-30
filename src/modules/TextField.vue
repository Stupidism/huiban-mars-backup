<template>
  <label class="text-field" :class="{'no-left-padding': noLeftPadding}">
    <span v-if="showRequiredColumn" class="required-marker">*</span>
    <span v-if="label" class="field-name">{{label}}</span>
    <slot name="left"></slot>
    <input
      type="text"
      :value="value"
      @input="onChange"
      :placeholder="placeholder"
      confirm-type="next"
      :disabled="disabled"
    >
    <slot name="right"></slot>
  </label>
</template>
<script>
import { consumer } from '@/mixins/context';

export default {
  props: {
    name: String,
    placeholder: {},
    label: {},
    defaultValue: String,
    required: Boolean,
    disabled: Boolean,
  },
  data() {
    return {
      ownValue: this.defaultValue,
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
  },
  consume() {
    return {
      formName: 'formName',
      fields: 'fields',
      updateFields: 'updateFields',
      showRequiredColumn: 'showRequiredColumn',
      noLeftPadding: 'noLeftPadding',
    };
  },
  methods: {
    onChange(event) {
      const value = event.target.value;
      this.ownValue = value;
      setTimeout(() => this.updateFields({ [this.name]: value }));
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
    color: red;
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
