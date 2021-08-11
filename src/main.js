import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import AVue from '@/components/avue';
import VueI18n from './language';

import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import BaseSelectImg from '@/components/base/BaseSelectImg';
import BaseViewTopic from '@components/base/BaseViewTopic';

dayjs.extend(utc);
dayjs.extend(timezone);

if (process.env.NODE_ENV === 'development') {
  require('dayjs/locale/zh-cn');
}

import '@/assets/styles/index.scss'; // 全局css
import './permission.js'; // 路由权限

const app = createApp(App);

if (process.env.VUE_APP_PROJECT !== 'pro') {
  // if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in window) {
  // 这里__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue赋值一个createApp实例
  // window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app;
  // }
  app.config.devtools = true;
}
AVue.install(app);
app.component('BaseSelectImg', BaseSelectImg);
app.component('BaseViewTopic', BaseViewTopic);
app.use(ElementPlus, { locale });
app.use(store);
app.use(VueI18n);
app.use(router).mount('#app');
