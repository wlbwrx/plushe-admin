import Layout from '@/views/layout/index.vue';

export default {
  path: '',
  component: Layout,
  meta: {
    key: 'app-config',
    title: 'APP配置',
    icon: 'icon-app',
  },
  children: [
    {
      path: '/app-notification',
      name: 'app-notification',
      component: () => import('@/views/app-config/Notification.vue'),
      meta: {
        title: '通知管理',
      },
    },
    {
      path: '/app-shop',
      name: 'app-shop',
      component: () => import('@/views/app-config/Shop.vue'),
      meta: {
        title: '店铺管理',
      },
    },
    {
      path: '/app-classify',
      name: 'app-classify',
      component: () => import('@/views/app-config/Classify.vue'),
      meta: {
        title: '分类管理',
      },
    },
    {
      path: '/app-banner',
      name: 'app-banner',
      component: () => import('@/views/app-config/Banner.vue'),
      meta: {
        title: 'banner配置',
      },
    },
    {
      path: '/app-instagram',
      name: 'app-instagram',
      component: () => import('@/views/app-config/Instagram.vue'),
      meta: {
        title: 'plushe_official',
      },
    },
    {
      path: '/vajra-hurdle',
      name: 'vajra-hurdle',
      component: () => import('@/views/app-config/VajraHurdle.vue'),
      meta: {
        title: '首页分类',
      },
    },
    {
      path: '/flash-sale',
      name: 'flash-sale',
      component: () => import('@/views/app-config/FlashSale.vue'),
      meta: {
        title: '闪购模块',
      },
    },
    {
      path: '/new-arrivals',
      name: 'new-arrivals',
      component: () => import('@/views/app-config/NewArrivals.vue'),
      meta: {
        title: '新品配置',
      },
    },
    {
      path: '/custom-one',
      name: 'custom-one',
      component: () => import('@/views/app-config/CustomOne.vue'),
      meta: {
        title: '自定义模块一',
      },
    },
    {
      path: '/custom-two',
      name: 'floor',
      component: () => import('@/views/app-config/CustomTwo.vue'),
      meta: {
        title: '自定义模块二',
      },
    },
    {
      path: '/image-set',
      name: 'image-set',
      component: () => import('@/views/app-config/imageSet.vue'),
      meta: {
        title: '图片配置',
      }
    },
  ],
};
