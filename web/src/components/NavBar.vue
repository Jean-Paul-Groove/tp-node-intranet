<template>
  <header class="header">
    <a class="branding" @click="$router.push({name:'home'})">
      <FontAwesomeIcon :icon="['fas', 'sitemap']" /><span>Intranet</span>
    </a>
    <nav class="header_nav">
      <div class="header_nav_connected" v-if="isConnected">
        <ListButton  :class="{header_nav_current:$route.name==='listing'}"  />
        <AddUserButton :class="{header_nav_current:$route.name==='profile-new'}" v-if="userInfo?.isAdmin" />
        <UserButton />
      </div>
      <ConnexionButton />
    </nav>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import ConnexionButton from "./ConnexionButton.vue";
import { useAuthStore } from "../stores/auth";
import UserButton from "./UserButton.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import ListButton from "./ListButton.vue";
import AddUserButton from "./AddUserButton.vue";
import { useRoute, useRouter } from "vue-router";
const { isConnected, userInfo } = storeToRefs(useAuthStore());

const $route=useRoute()
const $router = useRouter()
</script>

<style scoped>
.header {
  height: 3rem;
  padding: 0 1rem;
  color: white;
  display: flex;
  justify-content: space-between;
  background: var(--bg-primary);
}
.branding {
  height: 100%;
  display: flex;
  gap: 1rem;
  align-items: center;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
}
.logo {
  height: 100%;
}
.header_nav {
  display: flex;
  height: 100%;
  align-items: center;
  gap: 1rem;
}
.header_nav_connected {
  display: flex;
  height: 100%;
  align-items: center;
}
.header_nav_current{
  backdrop-filter: saturate(80%);
}
</style>
