<script setup lang="ts">
import type { Member } from "~/pages/app.vue";

defineProps<{ member: Member; selected: boolean; order: number }>();
</script>

<template>
  <button
    class="flex gap-2 py-3 px-3"
    :class="{
      'outline-2 -outline-offset-1 outline-primary rounded-lg': selected,
    }"
  >
    <span>{{ order }}.</span>
    <span class="font-semibold text-left">
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
      <span>{{ member.drinks ?? 0 }}</span>
    </div>
  </button>
</template>
