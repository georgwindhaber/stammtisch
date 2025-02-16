<script setup lang="ts">
const selected = ref([]);

const colums = [
  {
    key: "name",
    label: "Name",
  },
  { key: "drinks", label: "Bier" },
];

const members = [
  { name: "Hannes Apfelbacher", drinks: 641 },
  { name: "Roman Froihofer", drinks: 495 },
  { name: "Christian Rinnhofer", drinks: 472 },
  { name: "Philipp Paier", drinks: 401 },
  { name: "Hannes Buchebner", drinks: 272 },
  { name: "Matthias Meierhofer", drinks: 214 },
  { name: "Markus Buchebner", drinks: 164 },
];
</script>

<template>
  <UContainer>
    <UTable v-model="selected" :rows="members" :columns="colums" />
  </UContainer>
</template>
