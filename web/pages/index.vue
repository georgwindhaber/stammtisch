<script setup lang="ts">
import Axios from "axios";
import { ref } from "vue";

const drinks = ref([])

if (process.client) {
  try {

    const drinksResponse = await Axios.get('http://localhost:1337/api/drinks', {
      headers: {
        Authorization:
          "Bearer " + localStorage.jwt
      }
    })
    console.log(drinksResponse)
  }
  catch (err) {
    console.log(err)
  }
}

</script>

<template>
  <h1>Hello world</h1>
</template>
