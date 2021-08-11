const modules = [];
const moduleList = require.context(
  // 其组件目录的相对路径
  './',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /(\index.vue)$/
);

moduleList.keys().forEach(files => {
  // const componentName = moduleList(files).default.name;
  modules.push(moduleList(files).default);
});

export default modules;
