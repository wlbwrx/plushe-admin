import Layout from '@/views/layout/index.vue';

export default {
  path: '',
  component: Layout,
  meta: {
    key: 'label',
    title: '标签管理',
    icon: 'icon-daoru'
  },
  children: [
    {
      path: '/topic-config',
      name: 'topic-config',
      component: () => import('@/views/label/TopicConfig.vue'),
      meta: {
        title: '专题配置',
        icon: 'icon-daoru'
      }
    }
  ],
};
