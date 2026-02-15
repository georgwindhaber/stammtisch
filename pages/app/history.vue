<script setup lang="ts">
const history = await useFetch("/api/history");

if (!history.data.value) {
  throw new Error("Failed to fetch history data");
}

const rows = [
  ...history.data.value.drinks.map((entry) => ({ ...entry, type: "drinks" })),
  ...history.data.value.paid.map((entry) => ({ ...entry, type: "paid" })),
  ...history.data.value.rounds.map((entry) => ({ ...entry, type: "rounds" })),
].sort((a, b) => {
  const dateA = new Date(a.createdAt);
  const dateB = new Date(b.createdAt);
  return dateB.getTime() - dateA.getTime();
});
</script>

<template>
  <div class="flex flex-col divide-surface-container-highest w-full divide-y">
    <div v-for="entry of rows" class="py-3">
      <div class="text-primary flex items-center gap-2">
        <icon
          v-if="entry.type === 'drinks'"
          name="tdesign:beer"
          class="text-lg"
        />
        <icon
          v-else-if="entry.type === 'paid'"
          name="material-symbols:euro-rounded"
          class="text-lg"
        />
        <icon
          v-else-if="entry.type === 'rounds'"
          name="material-symbols:groups-rounded"
          class="text-lg"
        />
        {{ entry.value }} -
        {{ entry.userName }}
      </div>
      <div class="text-secondary text-sm">
        {{ new Date(entry.createdAt).toLocaleString() }},

        {{ entry.createdByName }}
      </div>
    </div>
  </div>
</template>
