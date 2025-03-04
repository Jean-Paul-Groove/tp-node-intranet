<template>
  <div class="login">
    <h1>Connexion</h1>
    <form @submit="onSubmit" class="login_form">
      <p>Pour vous connecter à l'intranet, entrez votre identifiant et votre mot de passe.</p>
        <span class="login_error-message">{{ errorMessage }}</span>
      <label for="email" class="login_label">
        <span class="login_label-text"> Email: </span>
        <input
          type="email"
          :class="{'error':errors.email}" 
          id="email"
          placeholder="example@fake.com"
          v-model="credentials.email"
          class="login_input"
      /></label>
      <label for="password" class="login_label">
        <span class="login_label-text"> Mot de passe: </span>
        <input :class="{'error':errors.password}" type="password" id="password" v-model="credentials.password" class="login_input" />
      </label>
    <button class="login_button">Connexion</button>
    </form>
  </div>
</template>
<script setup lang="ts">
import axios from 'axios'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const $router = useRouter()
const {setToken} = useAuthStore()
const credentials = ref<{email:string,password:string}>({email:'', password:''})
const validate = ref(false)
const errorMessage = ref('')

const errors = computed(()=> {
  const errors =  { email: false, password: false }
if(validate.value === false){
  return errors
}
return {email:credentials.value.email.trim()==='', password: credentials.value.email.trim()===''}
}
)

async function onSubmit(e: Event):Promise<void> {
  if(validate.value === false){
    validate.value = true
  }
  errorMessage.value =''
  e.stopPropagation()
  e.preventDefault()
  try{
    const res = await axios.post(import.meta.env.VITE_API_URL +'/login', credentials.value)
   if(res.data.token){
    setToken(res.data.token)
   }
  }catch(error:any){
    if(error?.status === 401){
      errorMessage.value = 'Identifiants incorrects, veuillez réessayer'
    }
console.log(error)
  }
}
</script>
<style>
@media (min-width: 1024px) {
  .login {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    align-items: center;
  }
}
.login_form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.login_label {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  gap: 1rem;
}
.login_input {
  width: 15rem;
  padding: 0.5rem 0.8rem;
}
.login_label-text {
  text-align: right;
  width: 7rem;
}
.login_button {
  margin: auto;
}
.login_error-message{
  color: red;
  font-weight: bold;
  text-align: center;
}
.error {
  border: 1px solid red;
}
</style>
