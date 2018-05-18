<template>
  <div :class="className">
    <slot></slot>
  </div>
</template>
<script>
import { exposer } from '@/mixins/context';

export default {
  props: {
    name: String,
    className: String,
    showRequiredColumn: Boolean,
    noLeftPadding: Boolean,
  },
  data() {
    return {
      fields: {},
    };
  },
  computed: {
  },
  methods: {
    registerField(name, initValue) {
      this.fields[name] = initValue;
    },
    updateFields(newFields) {
      this.fields = { ...this.fields, ...newFields };
    },
  },
  expose() {
    return {
      formName: this.name,
      showRequiredColumn: this.showRequiredColumn,
      noLeftPadding: this.noLeftPadding,
      fields: this.fields,
      registerField: this.registerField.bind(this),
      updateFields: this.updateFields.bind(this),
    };
  },
  mixins: [
    exposer,
  ],
};
</script>
