<template>
  <div :class="className">
    <slot></slot>
  </div>
</template>
<script>
import _ from 'lodash';
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
      metas: _.mapValues(this.initialValues, () => ({})),
      fieldNum: 0,
      controlFocusStatus: false,
    };
  },
  computed: {
    fields() {
      return {
        ...this.values,
        ...this.ownFields,
      };
    },
    focusedFieldMeta() {
      return _.find(this.metas, ['focused', true]);
    },
    focusedIndex() {
      return this.focusedFieldMeta ? this.focusedFieldMeta.index : -1;
    },
    nextFieldMeta() {
      if (this.focusedIndex < 0) return null;
      return _.find(this.metas, ['index', this.focusedIndex + 1]);
    },
  },
  methods: {
    registerField(name) {
      if (!this.metas[name]) {
        this.metas[name] = {
          name,
        };

        // throw new Error(`[ProviderForm] Unknown field name: ${name},
        // you need to provide it in initialValues`);
      }

      if (this.metas[name].index != null) {
        throw new Error(`[ProviderForm] Duplicated field name: ${name}`);
      }

      this.metas = {
        ...this.metas,
        [name]: {
          name,
          index: this.fieldNum,
          focused: !this.fieldNum,
        },
      };

      this.fieldNum += 1;
    },
    updateFields(newFields) {
      this.ownFields = { ...this.ownFields, ...newFields };
      this.onChange(this.ownFields);
    },
    updateMetas(newMetas) {
      this.metas = _.merge({}, this.metas, newMetas);
    },
    onNextField(type) {
      if (type === 'done') {
        if (this.focusedFieldMeta) {
          this.onFieldBlur(this.focusedFieldMeta.name);
        }
        this.controlFocusStatus = false;
      } else if (type === 'next') {
        if (this.nextFieldMeta) {
          this.onFieldFocus(this.nextFieldMeta.name);
        }
        this.controlFocusStatus = true;
      }
    },
    onFieldFocus(name) {
      if (this.focusedFieldMeta && this.focusedFieldMeta.name !== name) {
        this.onFieldBlur(this.focusedFieldMeta.name);
      }
      this.updateMetas({
        [name]: {
          focused: true,
          touched: true,
        },
      });
    },
    onFieldBlur(name) {
      this.updateMetas({
        [name]: { focused: false },
      });
    },
  },
  mounted() {
    this.fields = this.initialValues;
  },
  expose() {
    return {
      formName: this.name,
      showRequiredColumn: this.showRequiredColumn,
      controlFocusStatus: this.controlFocusStatus,
      noLeftPadding: this.noLeftPadding,
      fields: this.fields,
      metas: this.metas,
      updateFields: this.updateFields.bind(this),
      updateMetas: this.updateMetas.bind(this),
      onNextField: this.onNextField.bind(this),
      onFieldFocus: this.onFieldFocus.bind(this),
      onFieldBlur: this.onFieldBlur.bind(this),
      registerField: this.registerField.bind(this),
    };
  },
  mixins: [
    exposer,
  ],
};
</script>
