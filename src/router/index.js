import { createRouter, createWebHistory } from 'vue-router';
import DashBoard from '@/components/DashBoard.vue';
import GradeBook from '@/components/GradeBook.vue';
import AttenDance from '@/components/AttenDance.vue';
import BehaviorManagement from '@/components/BehaviorManagement.vue';

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'DashBoard', component: DashBoard },
  { path: '/dashboard/gradeBook', name: 'GradeBook', component: GradeBook },
  { path: '/dashboard/attenDance', name: 'AttenDance', component: AttenDance },
  { path: '/dashboard/behavior', name: 'BehaviorManagement', component: BehaviorManagement },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
