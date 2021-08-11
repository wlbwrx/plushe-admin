import Layout from '@/views/layout/index.vue';

export default {
  path: '',
  component: Layout,
  meta: {
    key: 'order',
    title: '订单管理',
    icon: 'icon-order'
  },
  children: [
    {
      path: '/order',
      name: 'order-list',
      component: () => import('@/views/order/List.vue'),
      meta: {
        title: '订单列表',
        icon: 'icon-order'
      }
    },
    {
      path: '/order-detail',
      name: 'order-detail',
      hidden: true,
      component: () => import('@/views/order/Detail.vue'),
      meta: {
        title: '订单详情'
      }
    },
    {
      path: '/logistics',
      name: 'logistics',
      component: () => import('@/views/order/Logistics.vue'),
      meta: {
        title: '物流导入'
      }
    },
    {
      path: '/logistics-list',
      name: 'logistics-list',
      component: () => import('@/views/order/LogisticsList.vue'),
      meta: {
        title: '物流列表'
      },
    },
  ],
};
