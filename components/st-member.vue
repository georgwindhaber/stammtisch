<script setup lang="ts">
import type { Member } from "~/pages/app.vue";

defineProps<{ member: Member; selected: boolean; order: number }>();
</script>

<template>
  <button
    class="grid grid-cols-subgrid col-span-5 gap-2 py-3 px-3"
    :class="{
      'outline-2 -outline-offset-1 outline-primary rounded-lg': selected,
    }"
  >
    <span>{{ order }}.</span>
    <span class="font-semibold text-left">
      {{ member.name }}
    </span>

    <span class="flex justify-center items-center gap-1 text-secondary">
      {{ member.rounds ?? 0 }}
    </span>
    <span class="flex justify-center items-center gap-1 text-secondary">
      {{ member.paid ?? 0 }}
    </span>
    <div class="text-primary flex items-center justify-center gap-1">
      <span>{{ member.drinks ?? 0 }}</span>
    </div>
  </button>
</template>
