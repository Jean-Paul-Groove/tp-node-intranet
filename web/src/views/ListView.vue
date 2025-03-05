<template>
  <main class="list">
    <h1 class="list_title">Liste des collaborateurs</h1>
    <form class="list_form">
      <input
        class="list_form_input"
        type="text"
        placeholder="Recherche"
        v-model="listOptions.search"
      />
      <label class="list_form_label">
        <span>Catégorie:</span>
        <select v-model="listOptions.category" class="list_form_input">
          <option
            :value="option.value"
            :key="option.value"
            v-for="option of categoryOptions"
          >
            {{ option.label }}
          </option>
        </select></label
      >
    </form>
    <section>
      <div class="list_result">
        <UserCard :can-edit="userInfo?.isAdmin" v-for="user of users" :key="user._id" :user="user" @delete="fetchUsers" />
      </div>
      <div class="list_pagination">
        <a
        @click="pagination.page = page"
        :key="page"
          :class="{ selected: page === pagination.page }"
          class="list_pagination_link"
          v-for="page of Math.ceil(pagination.total / pagination.size)"
          >{{ page }}</a
        >
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { User } from "../types/user";
import axios from "axios";
import UserCard from "../components/UserCard.vue";
import { debounce } from "lodash";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";

const {userInfo} = storeToRefs(useAuthStore())
const categoryOptions = [
  { value: "none", label: "- Aucun -" },
  { value: "Technique", label: "Technique" },
  { value: "Marketing", label: "Marketing" },
  { value: "Client", label: "Client" },
];
const listOptions = ref<{ search: string; category: string }>({
  search: "",
  category: "none",
});
const users = ref<User[]>([]);
const pagination = ref<{ page: number; total: number; size: number }>({
  page: 1,
  size: 10,
  total: 0,
});
watch(
  () => [listOptions.value, pagination.value.page, pagination.value.size],
  debounce(fetchUsers, 500),
  { deep: true }
);
onMounted(() => fetchUsers());

async function fetchUsers() {
  try {
    const res = await axios.post(import.meta.env.VITE_API_URL + "/users/search", {
      options: listOptions.value,
      pagination: pagination.value,
    });
    users.value = res.data.users;
    pagination.value.total = res.data.total;
  } catch (error) {
    console.log(error);
  }
}
</script>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.list_title {
  padding: 2rem 0;
  width: 100%;
  text-align: center;
  border-bottom: 1px solid rgb(206, 206, 206);
}
.list_form {
  padding: 0.5rem 0;
  display: flex;
  gap: 1rem;
}
.list_form_input {
  height: 2rem;
  padding: 0 1rem;
  border-radius: 0.3rem;
  background-color: white;
  box-shadow: none;
  border: 1px solid gray;
}
.list_form_label {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
.list_result {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.5rem;
}
.list_pagination{
  padding: 1rem;
  display: flex;
  flex-direction: row;
  gap: .5rem;
  align-items: center;
  justify-content: center;
}
.list_pagination_link{
  cursor: pointer;
}
.list_pagination_link:hover{
  text-decoration: underline;
}
.list_pagination_link.selected{
font-weight: bolder;
text-decoration: underline;
}
</style>
