import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '/add',
        component: () => import('../pages/AddExpense/AddExpense.vue'),
      },
      {
        path: '/allexpenses',
        component: () => import('../pages/AllExpenses/AllExpenses.vue'),
      },
      { path: '/', component: () => import('../pages/Index/Index.vue') },
      {
        path: '/registration',
        component: () => import('../pages/Auth/Auth.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('../pages/Error404.vue'),
  },
];

export default routes;
