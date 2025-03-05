<template>
  <div class="delete-modal_wrapper">
    <div class="delete-modal">
      <button class="delete-modal_x" @click="emit('cancel')">
        <FontAwesomeIcon :icon="faXmark" />
      </button>
      <p>Êtes-vous sûr de vouloir supprimer l'utilisateur suivant :</p>
      <UserCard :user="user" :can-edit="false" />
      <div class="delete-modal_buttons">
        <button @click="emit('delete')">CONFIRMER</button>
        <button @click="emit('cancel')">ANNULER</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import type { User } from "../types/user";
import UserCard from "./UserCard.vue";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface DeleteModalProps {
  user: User;
}
defineProps<DeleteModalProps>();
const emit = defineEmits(["cancel", "delete"]);
</script>

<style scoped>
.delete-modal_wrapper{
    position: fixed;
    inset: 0;
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
}
.delete-modal{
    position: absolute;
    background-color: white;
    border: 1px solid;
    padding: 1rem;
}
.delete-modal_x{
    position: absolute;
    top: 0;
    right: 0;
}
.delete-modal_buttons{
    margin-top: .5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 1rem;
}
</style>
