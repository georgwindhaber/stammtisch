<script setup lang="ts">
import { ref } from "vue";
import TextInput from "~/components/inputs/text-input.vue";
import ActionButton from "~/components/action-button.vue";
import Axios from "axios"

const email = ref("");
const password = ref("");
const error = ref("")

const login = async () => {

  try {

    const response = await Axios.post('http://localhost:1337/api/auth/local', { identifier: email.value, password: password.value })
    console.log(response)
  } catch (err) {
    if (err?.response?.data?.error?.name === 'ValidationError') {
      error.value = "Falsche Email-Adresse oder Passwort"
    }
  }

};
</script>

<template>
  <div class="container mx-auto">
    <h1 class="text-2xl font-bold text-blue-800">Stammtisch Login</h1>

    <div class="flex flex-col">
      <label for="email">Email</label>
      <text-input name="email" v-model="email" />
    </div>
    <div class="flex flex-col">
      <label for="password">Passwort</label>
      <text-input type="password" name="password" v-model="password" />
    </div>
    <action-button @click="login">Login</action-button>

    <div v-if="error" class="mt-5 p-3 bg-red-200 border-solid border border-red-400 rounded">
      {{ error }}
    </div>
  </div>
</template>
