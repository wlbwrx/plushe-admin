const modules = [];
const moduleList = require.context(
  // 其组件目录的相对路径
  './',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /(\.js)$/
);

moduleList.keys().forEach((fileName) => {
  if (!fileName.includes('index.js')) {
    modules.push(moduleList(fileName).default);
  }
});

export default modules;
