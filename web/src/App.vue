
<template>
  <div>
<NavBar/>

  <RouterView />
  </div>
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router';
import { NavBar } from './components';
</script>

<style scoped>

@media (min-width: 1024px) {
}
</style>
