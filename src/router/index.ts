import { createRouter, createWebHistory } from 'vue-router'
import CustomerPage from '@/pages/CustomerPage.vue'
import AdminPage from '@/pages/AdminPage.vue'
import CartPage from '@/pages/CartPage.vue'
import HomePage from '@/pages/HomePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/products',
      name: 'products',
      component: CustomerPage,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage,
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartPage,
    },
  ],
})

export default router
