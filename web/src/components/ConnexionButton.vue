<template>
  <button class="deconnexion-button" v-if="isConnected" @click="onDisconnect">
    <img :src="disconnect" alt="Disconnect" />
    <span> Déconnexion </span>
  </button>
  <div class="connexion-button" v-else>
    <img :src="connect" alt="Connect" />
    <span> Connexion </span>
  </div>
</template>

<script setup lang="ts">
import disconnect from "../assets/disconnect.svg";
import connect from "../assets/connect.svg";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const {  onDisconnect } = authStore;
const { isConnected } = storeToRefs(authStore);
</script>
<style scoped>
.connexion-button, .deconnexion-button {
  height: 100%;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  padding: .8rem 0.5rem;
  background: none;
}
.connexion-button{
justify-content: center;
}
.deconnexion-button:hover{
  background: none;
  backdrop-filter: invert(30%);
}
</style>
