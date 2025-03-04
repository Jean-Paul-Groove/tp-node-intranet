<template>
    <button class="user-button" @click="onclick">
<img class="user-button_photo" v-if="userInfo?.photo" :src="userInfo.photo" :alt="`${userInfo.firstname} ${userInfo.lastname}`">
    </button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
const $router = useRouter()
const {  userInfo } = storeToRefs(useAuthStore());

function onclick():void{
    $router.push({name:'profile'})
}

</script>

<style scoped>
.user-button{
    background-color: lightgray;
    border: none;
    height: 80%;
    aspect-ratio: 1;
    padding: 0;
    border-radius: 100%;
    overflow: hidden;
}
.user-button_photo{
width: 100%;
height: 100%;
object-fit: cover;

}
</style>