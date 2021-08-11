import Layout from '@/views/layout/index.vue';

export default {
  path: '',
  component: Layout,
  meta: {
    key: 'activities',
    title: '活动管理',
    icon: 'icon-activities'
  },
  children: [
    {
      path: '/activitie',
      name: 'activitie',
      component: () => import('@/views/activities/Activitie.vue'),
      meta: {
        title: '活动列表'
      }
    },
    {
      path: '/coupon',
      name: 'coupon',
      component: () => import('@/views/activities/Coupon.vue'),
      meta: {
        title: '优惠券列表'
      }
    }
  ]
};
