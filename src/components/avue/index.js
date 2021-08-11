import components from './ele-ui';

const install = function(Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component);
  });
};

export default {
  version: '1.0.0',
  install
};
