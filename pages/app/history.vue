<script setup lang="ts">
definePageMeta({
  name: "history",
});

const history = useFetch("/api/history");
</script>

<template>
  <section>
    <button v-for="entry of history.data.value">
      {{ entry.name }}
      {{ entry.value }}
      - by {{ entry.createdBy }}
    </button>

    {{ history.data.value }}
  </section>
</template>
