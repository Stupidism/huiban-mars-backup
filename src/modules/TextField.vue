<template>
  <label class="text-field" :class="{'no-left-padding': noLeftPadding}">
    <span v-if="showRequiredColumn" class="required-marker">*</span>
    <span class="field-name">{{label}}</span>
    <input
      type="text"
      :value="value"
      @input="onChange"
      :placeholder="placeholder"
      auto-focus
      confirm-type="next"
    >
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
      console.log(this.ownValue === undefined ? this.fieldValue : this.ownValue);
      return this.ownValue === undefined ? this.fieldValue : this.ownValue;
    },
  },
  consume() {
    return {
      formName: 'formName',
      fields: 'fields',
      registerField: 'registerField',
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
  created() {
    console.log('created', this);

    this.registerField(this.name, this.ownValue);
  },
};
</script>
<style lang="less">
.text-field {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: solid 0.5px #EAEAEA;

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
    margin-left: 20px;
    flex: 1;
  }
}
</style>
