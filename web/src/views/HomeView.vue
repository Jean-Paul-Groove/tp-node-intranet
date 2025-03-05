<template>
  <main class="home">
  <h1>Bienvenue sur l'intranet</h1>
  <p>La plate-forme de l'entreprise qui vous permet de retrouver tous vos collaborateurs</p>
  <div v-if="randomUser" class="home_random" >
  <p class="home_random_incitation">Avez-vous dit bonjour à :</p>
  <UserCard  :user="randomUser"/>
  <button class="home_random_button" @click="onGetRandom"> Dire bonjour à quelqu'un d'autre</button>
  </div>
  </main>
</template>
<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';
import type { User } from '../types/user';
import UserCard from '../components/UserCard.vue';

const randomUser = ref<User|null>(null)


onMounted(()=>onGetRandom())

async function onGetRandom():Promise<void>{
  try{
const res = await axios.get(import.meta.env.VITE_API_URL+'/users/random')
randomUser.value = res.data
  }catch(error){
    console.log(error)
  }
}
</script>
<style scoped>
.home{
  height:100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem;
}
.home_random{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .8rem;
}
.home_random_incitation{
  font-weight:600;
  font-size: 17px;
}
.home_random_button{
  margin: auto;
}
</style>
