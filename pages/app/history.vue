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
  <div class="grid grid-cols-4 gap-4">
    <div
      v-for="(entry, index) of rows"
      class="grid grid-cols-subgrid col-span-4"
    >
      <div>
        {{ index }}
      </div>
      <div>
        {{ entry.userId }}
      </div>
      <div>
        {{ new Date(entry.createdAt).toLocaleString() }}
      </div>
      <div>
        {{ entry.type }}
      </div>
    </div>
  </div>
</template>
