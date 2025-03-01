<script setup lang="ts">
const model = defineModel();
</script>

<template>
  <input
    type="number"
    v-model="model"
    class="p-1 bg-surface-container-low rounded-full text-center"
  />
</template>
