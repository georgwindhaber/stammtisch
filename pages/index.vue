<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const selectedUsers = ref<Array<number>>([]);

const tabs = [
  {
    key: "drinks",
    label: "Getrunken",
  },
  {
    key: "paid",
    label: "Bezahlt",
  },
  {
    key: "rounds",
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

const submit = async () => {
  const response = await $fetch("/api/drinks", {
    method: "POST",
    body: {
      users: selectedUsers.value.map((user) => user.userId),
      value: 1,
      mode: tabs[selectedTab.value].key,
    },
  });
  members.data.value = response;
  selectedUsers.value = [];
};

const membersInOrder = computed(() =>
  members.data.value?.sort(
    (member1, member2) => Number(member2.drinks) - Number(member1.drinks)
  )
);
</script>

<template>
  <UContainer v-if="selectedUsers">
    <UTabs :items="tabs" v-model="selectedTab" />
    <UTable
      v-model="selectedUsers"
      :empty-state="{
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'Keine Einträge',
      }"
      :rows="membersInOrder"
      :columns="colums"
    />
    <div class="flex gap-3 w-full justify-center">
      <UButton @click="submit" :disabled="!selectedUsers.length">
        +1 {{ tabs[selectedTab].label }}
      </UButton>
    </div>
  </UContainer>
</template>
