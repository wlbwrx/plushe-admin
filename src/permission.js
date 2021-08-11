import router from './router/index.js';
import store from './store/index.js';
import { getToken } from '@/utils/auth.js';
import { login } from '@/utils/util.js';

import NProgress from 'nprogress'; // Progress 进度条
import 'nprogress/nprogress.css'; // Progress 进度条样式

let registerRouteFresh = true; // 解决登录路由刷新

const whiteList = ['/login', '/resetPwd']; // 白名单，不需要token
router.beforeEach((to, from, next) => {
  NProgress.start();
  // console.log(getToken())
  if (!getToken()) {
    if (process.env.NODE_ENV === 'development') {
      if (to.path == '/login') next();
      next({
        path: whiteList.indexOf(to.path) != -1 ? to.path : '/login',
      });
    } else {
      login();
    }
    return;
  }
  if (to.path == '/login') return next({ path: '/home' });
  if (!registerRouteFresh) return next();
  store.dispatch('initData');
  store.dispatch('GenerateRoutes').then(routeList => {
    // 初始化添加动态路由
    const arr = [];
    routeList.forEach(element => {
      if (element.path) arr.push(element.path);
      if (element.children) {
        element.children.forEach(item => {
          if (item.path) arr.push(item.path);
        });
      }
    });
    registerRouteFresh = false;
    next({ ...to, replace: true });
  });
});
router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
