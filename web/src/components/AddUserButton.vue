<template>
    <button class="add-user-button" @click="onclick">
    <FontAwesomeIcon icon="user" /> Ajouter
    </button>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRouter } from 'vue-router';

const $router = useRouter()


function onclick(){
    $router.push({name:'profile-new'})
}
</script>

<style scoped>
.add-user-button{
    height: 100%;
    background: none;
    display: flex;
    gap: 
    .5rem;
    align-items: center;
    
}

</style>