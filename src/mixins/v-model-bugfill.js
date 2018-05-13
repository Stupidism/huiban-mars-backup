const VModelBugfill = {
  data() {
    return {
      ownValue: this.valueFromProp,
    };
  },
  model: {
    prop: 'valueFromProp',
  },
  props: ['valueFromProp'],
  computed: {
    value() {
      return this.ownValue === undefined ? this.valueFromProp : this.ownValue;
    },
  },
  methods: {
    onChange(event) {
      this.ownValue = event.target.value;
      setTimeout(() => this.$emit('input', event.target.value));
    },
  },
};

export default VModelBugfill;
