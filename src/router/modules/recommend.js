import Layout from '@/views/layout/index.vue';

export default {
  path: '',
  component: Layout,
  meta: {
    key: 'recommend',
    title: '商品推荐',
    icon: 'icon-recommend'
  },
  children: [
    {
      path: '/recommend-home',
      name: 'recommend-home',
      component: () => import('@/views/recommend/Home.vue'),
      meta: {
        title: '首页商品',
      }
    },
    {
      path: '/recommend-cart',
      name: 'recommend-cart',
      component: () => import('@/views/recommend/Cart.vue'),
      meta: {
        title: '购物车商品',
      }
    },
    {
      path: '/recommend-particulars',
      name: 'recommend-particulars',
      component: () => import('@/views/recommend/Particulars.vue'),
      meta: {
        title: '商品详情推荐',
      }
    },
  ]
};
