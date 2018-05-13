// Copied from HerringtonDarkholme/vue-advanced-programming
// Renamed and transplanted for mpvue
// https://github.com/HerringtonDarkholme/vue-advanced-programming/blob/master/context/index.js
import _ from 'lodash';
import _get from 'lodash/fp/get';

const getOptions = _get('$vnode.componentOptions.Ctor.options');

const $consume = (vm, { token, all }) => {
  let parent = vm;
  const ret = [];
  while (parent) {
    const $context = parent.$context;
    if ($context && _.has($context, token)) {
      const value = _.get($context, token);
      if (!all) return value;
      ret.push(value);
    }
    parent = parent.$parent;
  }
  return all ? ret : undefined;
};

const exposeContext = (vm) => {
  const options = getOptions(vm);
  if (!options.expose) return;
  options.computed.$context = () => options.expose.call(vm, vm);
};

const consumeContext = (vm) => {
  const options = getOptions(vm);
  if (!options.consume) return;
  const consumeMap = _.isFunction(options.consume) ? options.consume() : options.consume;

  options.computed = options.computed || {};
  _.forEach(consumeMap, (token, key) => {
    options.computed[key] = () => $consume(vm, { token });
  });
};

export const exposer = {
  beforeCreate() {
    exposeContext(this);
  },
  beforeUpdate() {
    exposeContext(this);
  },
};

export const consumer = {
  beforeCreate() {
    consumeContext(this);
  },
  beforeUpdate() {
    consumeContext(this);
  },
};
