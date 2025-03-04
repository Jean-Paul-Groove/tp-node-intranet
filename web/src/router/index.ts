import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '../stores/auth'
import ListView from '../views/ListView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/listing',
      name: 'listing',
      component: ListView,
    },
  ],
})
router.beforeEach(async (to, from)=> {
  if(to.name === 'login'){
    return true
  }
  const {isConnected} = useAuthStore()
  if(!isConnected){
    return {name:'login'}
  }
   return true
})
export default router
