const vModelBugfillMixin = {
  data() {
    return {
      ownValue: null,
    };
  },
  model: {
    prop: 'valueFromProp',
  },
  props: {
    valueFromProp: {
      type: String,
    },
  },
  computed: {
    value() {
      return this.ownValue == null ? this.valueFromProp : this.ownValue;
    },
  },
  methods: {
    onChange(event) {
      this.ownValue = event.target.value;
      setTimeout(() => this.$emit('input', event.target.value));
    },
  },
};

export default vModelBugfillMixin;
