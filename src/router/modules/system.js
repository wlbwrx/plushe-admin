import Layout from '@/views/layout/index.vue';

export default {
  path: '',
  component: Layout,
  meta: {
    key: 'system',
    title: '系统设置',
    icon: 'icon-system',
  },
  children: [
    {
      path: '/e_mail',
      name: 'system-e_mail',
      component: () => import('@/views/system/Email.vue'),
      meta: {
        title: '邮件模板',
      },
    },
    {
      path: '/message',
      name: 'system-message',
      component: () => import('@/views/system/Message.vue'),
      meta: {
        title: '站内信',
      },
    },
    {
      path: '/expressage',
      name: 'system-expressage',
      component: () => import('@/views/system/Expressage.vue'),
      meta: {
        title: '快递配置',
      },
    },
    {
      path: '/image-space',
      name: 'image-space',
      component: () => import('@/views/system/ImageSpace.vue'),
      meta: {
        title: '图片空间',
      },
    },
    {
      path: '/short-link',
      name: 'short-link',
      component: () => import('@/views/system/ShortLink.vue'),
      meta: {
        title: '短链设置',
      },
    },
  ],
};
