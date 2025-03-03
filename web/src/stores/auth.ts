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
   token.value = localStorage.getItem('token')
  })

function onConnect(){
    $router.push({'name':'login'})
}

function onDisconnect(){
    $router.push({'name':'login'})
    axios.get(import.meta.env.VITE_API_URL+'/disconnect')
    userInfo.value = null
    resetToken()
}
function setToken(newValue:string):void{
  localStorage.setItem('token',newValue)
  token.value = newValue
}
function resetToken():void{
  localStorage.removeItem('token')
  token.value = null
}
async function getUserInfo():Promise<void>{
  try{
 const res=  await axios.get(import.meta.env.VITE_API_URL+'/users/current', {"headers":{'Authorization':'Bearer '+token.value}})
 userInfo.value = res.data
 if($router.currentRoute.value.name === 'login'){
  $router.push({name:'home'})
 }
  }catch(error){console.log(error)}

}
  return { userInfo, isConnected,  token,onConnect,onDisconnect, setToken }
})
