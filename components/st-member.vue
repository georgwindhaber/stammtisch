<script setup lang="ts">
import type { Member } from "~/pages/app.vue";

defineProps<{ member: Member; selected: boolean }>();
</script>

<template>
  <button
    class="flex gap-2 bg-surface-container-lowest rounded-md px-4 py-3"
    :class="{ 'outline outline-primary': selected }"
  >
    <span class="font-bold text-left">
      {{ member.name }}
    </span>
    <div class="flex-1" />
    <div
      class="flex justify-end items-center gap-3 text-sm text-secondary mr-3"
    >
      <span class="flex justify-center items-center gap-1">
        <icon name="material-symbols:groups-rounded" class="text-lg" />
        {{ member.rounds ?? 0 }}
      </span>
      <span class="flex justify-center items-center gap-1">
        <icon name="material-symbols:euro-rounded" class="text-md" />
        {{ member.paid ?? 0 }}
      </span>
    </div>
    <div class="text-primary flex items-center justify-center gap-1">
      <icon name="tdesign:beer" />
      <span>{{ member.drinks }}</span>
    </div>
  </button>
</template>
