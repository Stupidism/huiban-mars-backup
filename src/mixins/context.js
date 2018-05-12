// Copied from HerringtonDarkholme/vue-advanced-programming
// Renamed and transplanted for mpvue
// https://github.com/HerringtonDarkholme/vue-advanced-programming/blob/master/context/index.js
import _ from 'lodash';
import _get from 'lodash/fp/get';

const getOptions = _get('$vnode.componentOptions.Ctor.options');

export const provider = {
  beforeCreate() {
    const options = getOptions(this);
    if (!options.provide) return;
    options.computed.$context = () => options.provide.call(this, this);
  },
};

const $consume = (vm, { token, all }) => {
  let parent = vm;
  const ret = [];
  while (parent) {
    const $context = parent.$context;
    if ($context && _.has($context, token)) {
      if (all) ret.push($context[token]);
      else return $context[token];
    }
    parent = parent.$parent;
  }
  return all ? ret : undefined;
};

export const consumer = {
  beforeCreate() {
    console.log('consumer beforeCreate');
    const options = getOptions(this);
    if (!options.consume) return;
    const vm = this;
    const computed = options.computed || {};
    _.forEach(options.consume, (token, key) => {
      computed[key] = () => $consume(vm, { token });
    });

    options.computed = computed;
  },
};
