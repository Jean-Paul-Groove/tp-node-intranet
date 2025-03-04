<template>
  <main class="list">
    <h1 class="list_title">Liste des collaborateurs</h1>
    <form class="list_form">
      <input
        class="list_form_input"
        type="text"
        placeholder="Recherche"
        v-model="search"
      />
<label class="list_form_label">
        <span>Catégorie:</span>
        <select v-model="category" class="list_form_input">
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
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";

const categoryOptions = [
  { value: "none", label: "- Aucun -" },
  { value: "Technique", label: "Technique" },
  { value: "Marketing", label: "Marketing" },
  { value: "Client", label: "Client" },
];

const search = ref<string>("");
const category = ref<string>("none");
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
.list_form_label{
    display: flex;
    gap: .5rem;
    align-items: center;
}
</style>
