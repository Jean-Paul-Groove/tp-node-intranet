<template>
  <figure class="user-card">
    <img class="user-card_photo" :src="user.photo" alt="" />
    <figCaption class="user-card_info">
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
      <p > <FontAwesomeIcon icon="phone"/> <span class="user-card_info_contact">{{ user.phone }}</span></p>
      </p>
      
      <p class="user-card_info_birthday">
        <FontAwesomeIcon icon="cake-candles"/>
        {{
          `Anniversaire: ${dayjs(user.birthdate).daysInMonth()} ${new Date(
            user.birthdate
          ).toLocaleDateString("fr-FR", { month: "long" })}`
        }}
      </p>
    </figCaption>
  </figure>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import type { User } from "../types/user";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

interface UserCardProps {
  user: User;
}
defineProps<UserCardProps>();
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
</script>

<style scoped>
.user-card {
  height: 11rem;
  width: 28rem;
  display: flex;
  gap: 2rem;
  box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.212);
  position: relative;

}
.user-card_photo {
  height: 100%;
  aspect-ratio: 1;
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
</style>
