<template>
    <button class="list-button" @click="onclick">
    <FontAwesomeIcon icon="list" /> Liste
    </button>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRouter } from 'vue-router';

const $router = useRouter()


function onclick(){
    $router.push({name:'listing'})
}
</script>

<style scoped>
.list-button{
    height: 100%;
    background: none;
    display: flex;
    gap: 
    .5rem;
    align-items: center;
    
}
.list-button:hover{
    font-weight: bolder;
}
</style>