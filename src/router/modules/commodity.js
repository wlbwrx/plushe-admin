import Layout from '@/views/layout/index.vue';

export default {
  path: '',
  component: Layout,
  meta: {
    key: 'commodity',
    title: '商品管理',
    icon: 'icon-clothes',
  },
  children: [
    {
      path: '/commodity-categories',
      name: 'commodity_categories',
      component: () => import('@/views/commodity/Categories.vue'),
      meta: {
        title: '类目管理',
      },
    },
    {
      path: '/commodity-attribute',
      name: 'commodity_attribute',
      component: () => import('@/views/commodity/Attribute.vue'),
      meta: {
        title: '属性管理',
      },
    },
    {
      path: '/commodity-list',
      name: 'commodity_list',
      component: () => import('@/views/commodity/List.vue'),
      meta: {
        title: '商品列表',
      },
    },
    {
      path: '/commodity-comment',
      name: 'commodity_comment',
      component: () => import('@/views/commodity/CommodityComment.vue'),
      meta: {
        title: '商品评论',
      },
    },
    {
      path: '/comment-list',
      name: 'comment_list',
      component: () => import('@/views/commodity/Comment.vue'),
      meta: {
        title: '评论列表',
      },
    },
    {
      path: '/commodity-batch',
      name: 'commodity-batch',
      indexHidden: true,
      component: () => import('@/views/commodity/BatchList.vue'),
      meta: {
        title: '商品创建记录',
      }
    },
    {
      path: '/commodity-size',
      name: 'commodity-size',
      component: () => import('@/views/commodity/sizeSet.vue'),
      meta: {
        title: '尺寸配置',
      }
    },
    {
      path: '/commodity-model',
      name: 'commodity-model',
      component: () => import('@/views/commodity/Model.vue'),
      meta: {
        title: '模特管理',
      }
    },
  ],
};
