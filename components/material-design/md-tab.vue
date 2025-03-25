<script setup lang="ts">
defineProps<{ selected?: boolean }>();
</script>

<template>
  <nuxt-link
    class="bg-surface relative min-w-28 h-12 flex justify-center items-center gap-2"
    active-class="group"
  >
    <div class="text-on-surface-variant group-[&]:text-on-surface">
      <slot></slot>
    </div>
    <div
      class="absolute bottom-0 w-full border-b-2 border-primary opacity-0 group-[&]:opacity-100"
    ></div>
  </nuxt-link>
</template>
