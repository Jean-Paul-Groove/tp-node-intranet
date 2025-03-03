<template>
    <header class="header">
<div class="branding">
<img class="logo" :src="sitemap" alt="Site map">
<span>Intranet</span>
</div>
<nav class="header_nav">
<UserButton v-if="userInfo"/>
<ConnexionButton/>
</nav>
    </header>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import sitemap from '../assets/sitemap.svg'
import ConnexionButton from './ConnexionButton.vue';
import { useAuthStore } from '../stores/auth';
import UserButton from './UserButton.vue';

const {  userInfo } = storeToRefs(useAuthStore());


</script>

<style scoped>
.header{
    height: 3rem;
    padding: 0 1rem;
    color: white;
    display: flex;
    justify-content: space-between;
    background: var(--bg-primary);
 }
.branding{
    height: 100%;
    display: flex;
    gap: 1rem;
    align-items: center;
    font-weight: bold;
    font-size: 1.2rem;
}
    .logo {
    height: 100%;
}
.header_nav{
    display: flex;
    height: 100%;
    align-items: center;
    gap: 1rem;
}
</style>