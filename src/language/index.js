import { createI18n } from 'vue-i18n';

let langObj = {};

const moduleList = require.context(
  // 其组件目录的相对路径
  './',
  // 是否查询其子目录
  false,
  // 匹配基础组件文件名的正则表达式
  /(\.js)$/
);
moduleList.keys().forEach(fileName => {
  langObj = Object.assign(langObj, moduleList(fileName).default);
});

const numberFormats = {
  'en-US': {
    currency: {
      style: 'currency',
      currency: 'USD',
      notation: 'standard',
    },
    decimal: {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
    percent: {
      style: 'percent',
      useGrouping: false,
    },
  },
  'ja-JP': {
    currency: {
      style: 'currency',
      currency: 'JPY',
      useGrouping: true,
      currencyDisplay: 'symbol',
    },
    decimal: {
      style: 'decimal',
      minimumSignificantDigits: 3,
      maximumSignificantDigits: 5,
    },
    percent: {
      style: 'percent',
      useGrouping: false,
    },
  },
};

const i18n = createI18n({
  // legacy: false, // you must set `false`, to use Composition API
  locale: 'en-US',
  messages: langObj,
  numberFormats,
});

export default i18n;
