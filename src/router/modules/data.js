import Layout from '@/views/layout/index.vue';

export default {
  path: '',
  component: Layout,
  meta: {
    key: 'data-management',
    title: '数据管理',
    icon: 'icon-shuju'
  },
  children: [
    {
      path: '/report',
      name: 'data-report',
      component: () => import('@/views/data-management/Report.vue'),
      meta: {
        title: '报表数据',
      }
    },
    {
      path: '/sku-visit',
      name: 'sku-visit-report',
      component: () => import('@/views/data-management/SkuVisit.vue'),
      meta: {
        title: 'SKU访问数据',
      }
    }
  ],
};
