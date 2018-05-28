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
    initialValues: Object,
    values: Object,
    onChange: Function,
  },
  data() {
    return {
      ownFields: this.initialValues,
    };
  },
  computed: {
    fields() {
      return {
        ...this.values,
        ...this.ownFields,
      };
    },
  },
  methods: {
    updateFields(newFields) {
      this.ownFields = { ...this.ownFields, ...newFields };
      this.onChange(this.ownFields);
    },
  },
  mounted() {
    this.fields = this.initialValues;
  },
  expose() {
    return {
      formName: this.name,
      showRequiredColumn: this.showRequiredColumn,
      noLeftPadding: this.noLeftPadding,
      fields: this.fields,
      updateFields: this.updateFields.bind(this),
    };
  },
  mixins: [
    exposer,
  ],
};
</script>
