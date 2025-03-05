<template>
  <figure class="user-card">
    <img class="user-card_photo" :src="user.photo" alt="" />
    <figcaption class="user-card_info">
      <p class="user-card_info_category" :style="{backgroundColor:getCategoryColor(user.category)}">{{ user.category }}</p>
      <p>
        <span class="user-card_info_name">
          {{ `${capitalizeString(user.firstname)} ${capitalizeString(user.lastname)}` }}
        </span>
        <span>{{ `(${getYears(user.birthdate)} ans)` }}</span>
      </p>
      <p class="user-card_info_adress">
        {{ `${capitalizeString(user.city)}, ${capitalizeString(user.country)}` }}
      </p>
      <p ><FontAwesomeIcon icon="envelope"/>
      <a class="user-card_info_contact" :href="`mailto:${user.email}?Subject=Bonjour`">
      {{ user.email }}
      </a>
      </p>
      <p > <FontAwesomeIcon icon="phone"/> <span class="user-card_info_contact">{{ user.phone }}</span></p>
      
      <p class="user-card_info_birthday">
        <FontAwesomeIcon icon="cake-candles"/>
        {{
          `Anniversaire: ${dayjs(user.birthdate).daysInMonth()} ${new Date(
            user.birthdate
          ).toLocaleDateString("fr-FR", { month: "long" })}`
        }}
      </p>
      <div class="user-card_info_edit" v-if="canEdit">
      <button @click="onEditProfile">EDITER</button>
      <button @click="deleteModal = true">SUPPRIMER</button>
      </div>
  
    </figcaption>
  <DeleteModal v-if="deleteModal" @cancel="deleteModal = false" @delete="onDeleteProfile" :user="user" />
  </figure>

</template>

<script setup lang="ts">
import dayjs from "dayjs";
import type { User } from "../types/user";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useRouter } from "vue-router";
import { ref } from "vue";
import DeleteModal from "./DeleteModal.vue";
import axios from "axios";

interface UserCardProps {
  user: User;
  canEdit?:boolean
}
const props = withDefaults(defineProps<UserCardProps>(), {canEdit:false});
const emit =defineEmits(['delete'])
const $router = useRouter()

const deleteModal = ref<boolean>(false)

function capitalizeString(string: string): string {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}
function getYears(birth: Date): number {
  const birthdate = dayjs(birth);
  const years = dayjs().diff(birthdate, "year");
  return years;
}
function getCategoryColor(category: User['category']){
    switch(category){
        case "Technique": return '#34b1eb'
        case "Marketing": return '#f757f2'
        case "Client": return '#57f79a'
    }
}
function onEditProfile(){
  $router.push({name:'profile', params:{id:props.user._id}})
}
async function onDeleteProfile(){
 try{
  await axios.delete(import.meta.env.VITE_API_URL+'/users/'+props.user._id)
  emit('delete')
 }catch(error){
  console.log(error)
 }
}
</script>

<style scoped>
.user-card {
  height: 11rem;
  width: 28rem;
  display: flex;
  gap: 2rem;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.212);
  position: relative;
  text-wrap:nowrap;
  text-overflow: ellipsis;
}
.user-card_photo {
  height: 100%;
  aspect-ratio: 1;
  object-fit: cover;
}
.user-card_info {
  color: gray;
  width: 100%;
  padding: 1.5rem 0;
}
.user-card_info_name {
  font-weight: bolder;
  color: black;
  margin-right: .5rem;
}
.user-card_info_contact{
    margin-left: .5rem;
    font-size: 13px;
    color: red;
    text-decoration: underline;
}
.user-card_info_category{
    color: white;
    position: absolute;
    top: 0;
    right: 0;
    padding: 0.1rem .4rem;
}
.user-card_info_birthday{
    display: flex;
    gap: .5rem;
    align-items: center;
}
.user-card_info_edit{
  display: flex;
  gap: .5rem;
  position: absolute;
  bottom: 0;
}
</style>
