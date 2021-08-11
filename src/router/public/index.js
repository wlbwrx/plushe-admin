import Layout from '@/views/layout/index.vue';

export default [
  {
    path: '/login',
    hidden: true, // 不显示在左侧菜单栏
    meta: {
      title: '登录',
    },
    component: () => import('@/views/layout/Login'),
  },
  {
    path: '/resetPwd',
    hidden: true,
    meta: {
      title: '重置密码',
    },
    component: () => import('@/views/layout/ResetPwd'),
  },
  {
    path: '/404',
    hidden: true,
    component: () => import('@/views/layout/404'),
  },
  {
    path: '',
    name: 'Home',
    redirect: '/home',
    component: Layout,
    hidden: true,
    meta: {
      title: '首页',
      icon: 'el-icon-s-home',
    },
    children: [
      {
        path: 'home',
        name: 'home',
        meta: {
          title: '首页',
        },
        component: () => import('@/views/home'),
      },
    ],
  },
];
