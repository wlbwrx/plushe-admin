import {
  createRouter,
  createWebHashHistory,
  // createWebHistory
} from 'vue-router';
import publicRoute from './public';

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: publicRoute,
});

export default router;
