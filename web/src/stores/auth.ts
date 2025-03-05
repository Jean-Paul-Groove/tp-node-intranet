import { ref, computed, watch, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios from 'axios'
import type { User } from '../types/user'

export const useAuthStore = defineStore('user', () => {
  const userInfo  = ref<User|null>(null)
  const isConnected = computed(()=>  userInfo.value !=null)
  const token = ref<string|null>(null)
  const $router = useRouter()

  watch(()=>token.value, (newToken,oldToken)=>{
    if(oldToken == null && newToken != null){
      void fetchCurrentUser()
    }
  })

  onMounted(()=> {
    const formerToken = localStorage.getItem('JWT')
    if(formerToken !=null){
      setToken(formerToken)
    }
  })

function onDisconnect(){
    $router.push({'name':'login'})
    userInfo.value = null
    resetToken()
}
function setToken(newValue:string):void{
  localStorage.setItem('JWT',newValue)
  token.value = newValue
  axios.defaults.headers.authorization = 'Bearer '+token.value
}
function resetToken():void{
  localStorage.removeItem('JWT')
  token.value = null
}
async function fetchCurrentUser():Promise<void>{
  try{
if(!token.value){
  return
}
      const res=  await axios.get(import.meta.env.VITE_API_URL+'/users/current')
      userInfo.value = res.data
      console.log(res.data)
      if($router.currentRoute.value.name === 'login'){
        $router.push({name:'home'})
      }
    
  }catch(error){console.log(error)
    resetToken()
  }

}
  return { userInfo, isConnected,  token, onDisconnect,fetchCurrentUser, setToken,  }
})
