<script setup lang="ts">
const model = defineModel();
</script>

<template>
  <input
    type="text"
    v-model="model"
    class="p-1 bg-surface-container-low rounded-full text-center h-12 min-w-12"
  />
</template>
