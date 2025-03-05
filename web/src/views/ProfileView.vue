<template>
  <main class="profile">
    <h1 v-if="pageType === 'edit-current'" class="profile_title">Modifier mon profil</h1>
    <h1 v-else-if="pageType === 'edit-other'" class="profile_title">
      Modifier le profil
    </h1>
    <h1 v-else class="profile_title">Créer un nouvel utilisateur</h1>
    <div v-if="success" class="profile_success">
    <p>{{ pageType ==='new' ? 'Utilisateur créé avec succès ! ' :' Profil modifié avec succès !' }}</p>
    </div>
    <form @submit="onSubmit" class="profile_form" autocomplete="off" v-else>
      <span v-if="userInfo?.isAdmin" class="profile_form_admin"
        ><FontAwesomeIcon class="profile_form_admin_warning" :icon="faWarning" /> Admin:
        <input type="checkbox" v-model="user.isAdmin"
      /></span>
      <label>
        * Civilité:
        <div v-if="errors.gender" class="profile_form_error">
          <span>{{ errors.gender }}</span>
        </div>
        <select :class="{ error: errors.gender }" v-model="user.gender">
          <option
            v-for="option of genderOptions"
            :value="option.value"
            :key="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
      <label>
        * Catégorie:
        <div v-if="errors.category" class="profile_form_error">
          <span>{{ errors.category }}</span>
        </div>
        <select :class="{ error: errors.category }" v-model="user.category">
          <option
            v-for="option of categoryOptions"
            :value="option.value"
            :key="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
      <label>
        * Nom:
        <div v-if="errors.lastname" class="profile_form_error">
          <span>{{ errors.lastname }}</span>
        </div>
        <input :class="{ error: errors.lastname }" type="text" v-model="user.lastname" />
      </label>
      <label>
        * Prénom:
        <div v-if="errors.firstname" class="profile_form_error">
          <span>{{ errors.firstname }}</span>
        </div>
        <input
          :class="{ error: errors.firstname }"
          type="text"
          v-model="user.firstname"
        />
      </label>
      <label>
        * Email:
        <div v-if="errors.email" class="profile_form_error">
          <span>{{ errors.email }}</span>
        </div>
        <input :class="{ error: errors.email }" type="email" v-model="user.email" />
      </label>
      <label>
        * Mot de passe:
        <div v-if="errors.password" class="profile_form_error">
          <span>{{ errors.password }}</span>
        </div>
        <input
          :class="{ error: errors.password }"
          type="password"
          placeholder="Min 8 charactères"
          v-model="password"
        />
      </label>
      <label>
        * Confirmation:

        <div v-if="errors.confirmPassword" class="profile_form_error">
          <span>{{ errors.confirmPassword }}</span>
        </div>
        <input
          :class="{ error: errors.confirmPassword }"
          type="password"
          placeholder="Min 8 charactères"
          v-model="confirmPassword"
        />
      </label>
      <label>
        * Téléphone:
        <div v-if="errors.phone" class="profile_form_error">
          <span>{{ errors.phone }}</span>
        </div>
        <input :class="{ error: errors.phone }" type="phone" v-model="user.phone" />
      </label>
      <label>
        * Date de naissance:
        <div v-if="errors.birthdate" class="profile_form_error">
          <span>{{ errors.birthdate }}</span>
        </div>
        <input
          :class="{ error: errors.birthdate }"
          type="date"
          @change="onChangeBirthDate"
          :value="dayjs(user.birthdate).format('YYYY-MM-DD')"
        />
      </label>
      <label>
        *Ville:
        <div v-if="errors.city" class="profile_form_error">
          <span>{{ errors.city }}</span>
        </div>
        <input :class="{ error: errors.city }" type="text" v-model="user.city" />
      </label>
      <label>
        * Pays:
        <div v-if="errors.country" class="profile_form_error">
          <span>{{ errors.country }}</span>
        </div>
        <input :class="{ error: errors.country }" type="text" v-model="user.country" />
      </label>
      <label>
        * URL de la photo:
        <input type="text" v-model="user.photo" />
      </label>
      <button v-if="Object.keys(errors).length === 0">{{pageType === 'new' ?'CREER' :'MODIFIER'}}</button>
    </form>
  </main>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from "vue";
import type { User } from "../types/user";
import axios from "axios";
import dayjs from "dayjs";
import { storeToRefs } from "pinia";
import { useAuthStore } from "../stores/auth";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";

// Props
interface ProfileViewProps {
  id?: string;
}
const props = defineProps<ProfileViewProps>();

// Const
const genderOptions = [
  { value: "male", label: "Homme" },
  { value: "female", label: "Femme" },
  { value: "other", label: "Autre" },
];
const categoryOptions = [
  { value: "Technique", label: "Technique" },
  { value: "Marketing", label: "Marketing" },
  { value: "Client", label: "Client" },
];
const phoneRegex = /^([\+]?[(]?[0-9]{2,3}[)]?)?[-\s\.]?[0-9]{1,3}([-\s\.]?[0-9]{2,4}){4,6}$/
const requiredString = ["firstname", "lastname", "email", "phone", "city", "country"];
const EMPTY_USER:Omit<User, "_id"> ={
  firstname: "",
  lastname: "",
  gender: "",
  birthdate: new Date(),
  email: "",
  phone: "",
  city: "",
  country: "",
  photo: "",
  category: "Client",
  isAdmin: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}
// Refs
const $router = useRouter();
const $route = useRoute();
const pageType = ref<"new" | "edit-current" | "edit-other">("new");
const { userInfo } = storeToRefs(useAuthStore());
const shouldValidate = ref<boolean>(false);
const user = ref<Omit<User, "_id">>(EMPTY_USER);
const password = ref("");
const confirmPassword = ref("");
const success = ref<boolean>(false)
// Computeds
const errors = computed(() => {
  const errors: any = {};
  if (!shouldValidate.value) {
    return errors;
  }
  for (const key of Object.keys(user.value)) {
    if (requiredString.includes(key)) {
      // @ts-ignore
      if ((user.value[key] as string).trim() === "")
        errors[key] = "Le champ ne peut pas être vide";
    }
    if (key === "gender") {
      if (!genderOptions.map((option) => option.value).includes(user.value.gender)) {
        errors.gender = "Cette civilité n'est pas reconnue";
      }
    }
    if (key === "category") {
      if (!categoryOptions.map((option) => option.value).includes(user.value.category)) {
        errors.category = "Cette catégorie n'est pas valide";
      }
    }   if (key === "phone") {
      if (!phoneRegex.test(user.value.phone)) {
        errors.phone = "Ce numéro n'est pas valide";
      }
    }
    if (key === "birthdate") {
      if (dayjs().diff(dayjs(user.value.birthdate), 'day') < 1) {
        errors.birthdate = "Cette date de naissance est trop récente";
      }
    }
  }
  if (pageType.value === "new") {
    if (password.value.trim().length === 0) {
      errors.password = "Le mot de passe doit faire au moins 8 charactères";
    }
  }
  if (password.value.length > 0 && password.value.length < 8) {
    errors.password = "Le mot de passe doit faire au moins 8 charactères";
  }
  if (password.value !== confirmPassword.value) {
    errors.confirmPassword = "Les mots de passes doivent être identiques";
  }
  return errors;
});
onBeforeMount(init);
watch(()=> [$route.name, $route.params], init,{deep:true})

function init(){
  const routeName = $router.currentRoute.value.name;
  if (props.id && routeName === "profile") {
    pageType.value = userInfo.value?._id === props.id ? "edit-current" : "edit-other";
    void fetchUser();
    return;
  }
  if (routeName === "profile-new") {
    user.value = EMPTY_USER
    return;
  }
  $router.replace({ name: "home" });
}

async function fetchUser(): Promise<void> {
  try {
    const res = await axios.get(import.meta.env.VITE_API_URL + "/users/" + props.id);
    user.value = res.data;
  } catch (error) {
    console.log(error);
  }
}
function onChangeBirthDate(e: Event): void {
  if (e?.target) {
    user.value.birthdate = new Date((e.target as HTMLInputElement).value);
  }
}
async function onSubmit(e: Event): Promise<void> {
  e.preventDefault();
  shouldValidate.value = true;
  try {
    if (Object.keys(errors.value).length === 0) {
      if (pageType.value === "new") {
        const data = { ...user.value, password: password.value };
        await axios.post(import.meta.env.VITE_API_URL + "/users", data);
        onSuccess()
      } else {
        const data =
          password.value.length > 0
            ? { ...user.value, password: password.value }
            : { ...user.value };
        await axios.put(import.meta.env.VITE_API_URL + "/users/" + props.id, data);
        onSuccess()
      }
    }
  } catch (error) {
    console.log(error);
  }
}
function onSuccess(){
  success.value = true
  setTimeout(()=>{
    $router.push({ name: "listing" });
  }, 2000)
}
</script>

<style scoped>
.profile {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
.profile_title {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid rgb(206, 206, 206);
}
.profile_success{
  color: green;
  border: 2px solid green;
  padding: 1rem;
  border-radius: .3rem;
}
.profile_form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  height: 100%;
}
.profile_form label {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 1rem;
  text-align: right;
  height: rem;
  position: relative;
}
.profile_form label input,
.profile_form label select {
  height: 2rem;
  padding: 0 1rem;
  border-radius: 0.3rem;
  background-color: white;
  box-shadow: none;
  border: 1px solid gray;
}
.error {
  outline: 1px solid red;
}
.profile_form_error {
  color: red;
  font-size: 12px;
  position: absolute;
  background-color: white;
  padding: 0.2rem;
  border-radius: 0.1rem;
  left: 50%;
  top: 10%;
}
.profile_form_admin {
  padding: 1rem;
  border: 2px solid rgb(255, 187, 0);
  border-radius: 0.3rem;
}

.profile_form_admin_warning {
  color: rgb(255, 187, 0);
}
</style>
