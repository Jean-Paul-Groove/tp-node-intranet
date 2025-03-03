<template>
  <Button class="connexion-button" v-if="isConnected" @click="onDisconnect">
    <img :src="disconnect" alt="Disconnect" />
    <span> Déconnexion </span>
  </Button>
  <Button class="connexion-button" v-else @click="onConnect">
    <img :src="connect" alt="Connect" />
    <span> Connexion </span>
  </Button>
</template>

<script setup lang="ts">
import disconnect from "../assets/disconnect.svg";
import connect from "../assets/connect.svg";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const { onConnect, onDisconnect } = authStore;
const { isConnected } = storeToRefs(authStore);
</script>
<style scoped>
.connexion-button {
  height: 100%;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
  backdrop-filter: saturate(80%);
}
</style>
