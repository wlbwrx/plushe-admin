import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import getters from './getters';

const modules = {};
const moduleList = require.context(
  // 其组件目录的相对路径
  './modules',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /(\.js)$/
);

moduleList.keys().forEach(fileName => {
  modules[fileName.match(/\/(\S*)\.js/)[1]] = moduleList(fileName).default;
});

export default createStore({
  // state: {},
  // mutations: {},
  // actions: {},
  modules,
  getters,
  plugins: [createPersistedState({ storage: window.sessionStorage })]
});
