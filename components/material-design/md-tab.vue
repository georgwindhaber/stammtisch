<script setup lang="ts">
defineProps<{ selected?: boolean }>();
</script>

<template>
  <button
    class="bg-surface relative min-w-28 h-12 flex justify-center items-center gap-2"
    :class="[selected ? 'text-on-surface' : 'text-on-surface-variant']"
  >
    <slot></slot>
    <div
      v-if="selected"
      class="absolute bottom-0 w-full border-b-2 border-primary"
    ></div>
  </button>
</template>
