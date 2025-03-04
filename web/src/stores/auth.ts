import { ref, computed, watch, onMounted } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import axios from 'axios'

export const useAuthStore = defineStore('user', () => {
  const userInfo  = ref<{firstname:string,lastname:string,photo:string |undefined} |null>(null)
  const isConnected = computed(()=>  userInfo.value !=null)
  const token = ref<string|null>(null)
  const $router = useRouter()

  watch(()=>token.value, (newToken,oldToken)=>{
    if(oldToken == null && newToken != null){
      void getUserInfo()
    }
  })

  onMounted(()=> {
    const formerToken = localStorage.getItem('JWT')
    if(formerToken !=null){
      setToken(formerToken)
    }
  })

function onConnect(){
    $router.push({'name':'login'})
}

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
async function getUserInfo():Promise<void>{
  try{

      const res=  await axios.get(import.meta.env.VITE_API_URL+'/users/current')
      userInfo.value = res.data
      if($router.currentRoute.value.name === 'login'){
        $router.push({name:'home'})
      }
    
  }catch(error){console.log(error)
    resetToken()
  }

}
  return { userInfo, isConnected,  token,onConnect,onDisconnect, setToken }
})
