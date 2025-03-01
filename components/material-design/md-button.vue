<script setup lang="ts">
const { theme = "primary" } = defineProps<{ theme?: "tonal" | "primary" }>();
</script>

<template>
  <button
    :class="[
      'block rounded-full py-2 px-5',
      theme === 'primary'
        ? 'bg-primary text-on-primary'
        : 'bg-secondary-container text-on-secondary-container',
      'hover:cursor-pointer hover:bg-primary/88',
      'disabled:cursor-not-allowed disabled:bg-primary/12 disabled:text-on-surface/50',
    ]"
  >
    <slot></slot>
  </button>
</template>
