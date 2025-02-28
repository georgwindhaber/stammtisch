<script setup lang="ts">
import type { Member } from "~/pages/app.vue";

defineProps<{ member: Member; selected: boolean }>();
</script>

<template>
  <button
    class="flex flex-col gap-2 bg-surface-container-lowest rounded-md px-4 py-3"
    :class="{ 'outline outline-primary': selected }"
  >
    <div class="flex justify-between">
      <span class="font-bold">
        {{ member.name }}
      </span>
      <span class="text-primary"> Getrunken {{ member.drinks }} </span>
    </div>

    <div class="flex justify-end gap-3 text-sm text-secondary">
      <span> Bezahlt {{ member.paid ?? 0 }} </span>
      <span> Runden {{ member.rounds ?? 0 }} </span>
    </div>
  </button>
</template>
