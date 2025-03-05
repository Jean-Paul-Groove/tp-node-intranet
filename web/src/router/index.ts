import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '../stores/auth'
import ListView from '../views/ListView.vue'
import { storeToRefs } from 'pinia'
import ProfileView from '../views/ProfileView.vue'

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
    {
      path: '/profile/new',
      name: 'profile-new',
      component: ProfileView,
      beforeEnter:() => {
        const {userInfo} = useAuthStore()
        if(userInfo?.isAdmin){
          return true
        }
        return {name:'home'}
      },
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: ProfileView,
      props:true,
      beforeEnter:(to) => {
        const {userInfo} = useAuthStore()
        if(!userInfo || !to.params.id){
          return false
        }
        if(userInfo.isAdmin){
          return true
        }
        if(to.params.id === userInfo._id){
          return true
        }
        return {name:'home'}
      },
    },
   
  ],
})
router.beforeEach(async (to) => {
  if (to.name === 'login') {
    return true
  }
  const authStore = useAuthStore()
  const { isConnected } = storeToRefs(authStore)

  if (!isConnected.value) {
    const { fetchCurrentUser } = authStore
    await fetchCurrentUser()
    if (!isConnected.value) {
      return { name: 'login' }
    }
  }
  return true
})
export default router
