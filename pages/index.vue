<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const selected = ref([]);

const tabs = [
  {
    label: "Getrunken",
  },
  {
    label: "Bezahlt",
  },
  {
    label: "Runden",
  },
];

const selectedTab = computed({
  get() {
    const index = tabs.findIndex((tab) => tab.label === route.query.tab);
    return index === -1 ? 0 : index;
  },
  set(value) {
    // Hash is specified here to prevent the page from scrolling to the top
    router.replace({
      query: { tab: tabs[value].label },
      hash: `#${tabs[value].label}`,
    });
  },
});

const colums = computed(() => {
  const base = [
    {
      key: "name",
      label: "Name",
    },
  ];

  if (selectedTab.value === 0) {
    base.push({ key: "drinks", label: "Getrunken" });
  } else if (selectedTab.value === 1) {
    base.push({ key: "paid", label: "Bezahlt" });
  } else if (selectedTab.value === 2) {
    base.push({ key: "rounds", label: "Runden" });
  }

  return base;
});

const members = await useFetch("/api/members");
</script>

<template>
  <UContainer v-if="members.data.value">
    <UTabs :items="tabs" v-model="selectedTab" />
    <UTable
      v-model="selected"
      :empty-state="{
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'Keine Einträge',
      }"
      :rows="members.data.value"
      :columns="colums"
    />
    <div class="flex gap-3 w-full justify-center">
      <UButton> +1 {{ tabs[selectedTab].label }} </UButton>
    </div>
  </UContainer>
</template>
