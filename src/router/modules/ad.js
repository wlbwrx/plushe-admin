import Layout from '@/views/layout/index.vue';

export default {
  path: '',
  component: Layout,
  meta: {
    key: 'ad-config',
    title: '广告管理',
    icon: 'icon-guanggao',
  },
  children: [
    {
      path: '/ad-list',
      name: 'ad-list',
      component: () => import('@/views/Ad/AdList.vue'),
      meta: {
        title: '广告列表',
      },
    },
  ],
};
