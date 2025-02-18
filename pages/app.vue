<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { signOut } = useAuth();

const selectedUsers = ref<
  Array<{
    name: string;
    paid: number;
    userId: number;
    drinks: string;
    rounds: number;
  }>
>([]);

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
  {
    key: "guests",
    label: "Gäste",
  },
];

const value = ref(1);
const isNumberInfoOpen = ref(false);

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

const members = await useFetch("/api/members");

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
    base.push({ key: "balance", label: "Guthaben" });
  } else if (selectedTab.value === 2) {
    base.push({ key: "rounds", label: "Runden" });
  }

  return base;
});

const submit = async () => {
  const response = await $fetch("/api/members", {
    method: "POST",
    body: {
      users: selectedUsers.value.map((user) => user.userId),
      value: value.value,
      mode: tabs[selectedTab.value].key,
    },
  });
  members.data.value = response;
  selectedUsers.value = [];
};

const membersInOrder = computed(() => {
  return members.data.value
    ?.sort(
      (member1, member2) => Number(member2.drinks) - Number(member1.drinks)
    )
    .map((m) => ({ ...m, balance: m.paid - m.drinks }));
});
</script>

<template>
  <div class="flex flex-col h-full">
    <UContainer>
      <UTabs :items="tabs" v-model="selectedTab" class="m-5" />
    </UContainer>
    <UContainer
      v-if="selectedUsers && selectedTab !== 3"
      class="flex flex-col h-full"
    >
      <UTable
        v-model="selectedUsers"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'Keine Einträge',
        }"
        :rows="membersInOrder"
        :columns="colums"
      />
      <div class="flex flex-col gap-3 w-full items-center mt-5">
        <div class="flex gap-3">
          <UInput v-model="value" type="number" />
          <UButton
            variant="soft"
            icon="material-symbols:info-outline-rounded"
            @click="isNumberInfoOpen = true"
          />
          <UModal v-model="isNumberInfoOpen">
            <div class="p-4">
              Du kaunst do a minus Zoin eigebn, foist di moi vertippt host
            </div>
          </UModal>
        </div>
        <UButton @click="submit" :disabled="!selectedUsers.length" class="mt-2">
          <template v-if="value > 0"> + </template>

          {{ value }} {{ tabs[selectedTab].label }}
        </UButton>
      </div>
    </UContainer>
    <div class="flex-1" />
    <footer class="flex justify-center items-center w-full p-3">
      <UButton @click="() => signOut({ callbackUrl: '/' })" variant="soft">
        Ausloggen
      </UButton>
    </footer>
  </div>
</template>
