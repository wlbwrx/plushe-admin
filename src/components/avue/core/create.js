import bem from '../utils/bem';
import field from '../utils/field';
// import setupFun from '../utils/setupFun';
const KEY_COMPONENT_NAME = 'avue-';
export default function(component) {
  const arr = ['switch', 'select', 'cascader', 'input', 'date-picker', 'button', 'tree', 'upload'].map(item => KEY_COMPONENT_NAME + item);
  component.name = KEY_COMPONENT_NAME + component.name.toLowerCase();
  component.mixins = component.mixins || [];
  component.mixins.push(bem);
  if (arr.includes(component.name)) {
    component.mixins.push(field);
    // component.setup = setupFun;
  }
  return component;
}
