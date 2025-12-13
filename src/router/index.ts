import { createRouter, createWebHistory } from 'vue-router'
import CustomerPage from '@/pages/CustomerPage.vue'
import AdminPage from '@/pages/AdminPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'customer',
      component: CustomerPage,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage,
    },
  ],
})

export default router
