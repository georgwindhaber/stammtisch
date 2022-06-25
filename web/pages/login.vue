<script setup>
import { ref } from "vue";
import TextInput from "~/components/inputs/text-input.vue";
import ActionButton from "~/components/action-button.vue";

const email = ref("");
const password = ref("");

const login = () => {
  console.log(email.value, password.value);
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
  </div>
</template>
