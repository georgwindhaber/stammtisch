<script setup lang="ts">
defineProps<{ icon: string }>();
</script>

<template>
  <button
    :class="[
      'flex justify-center items-center bg-secondary-container text-on-secondary-container rounded-full size-12 text-2xl',
      'hover:cursor-pointer hover:bg-primary/88',
      'disabled:cursor-not-allowed disabled:bg-primary/12 disabled:text-on-surface/50',
    ]"
  >
    <Icon :name="icon" />
  </button>
</template>
