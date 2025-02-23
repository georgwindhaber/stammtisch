<script setup lang="ts">
import Textarea from "~/components/textarea/textarea.vue";

const route = useRoute();
const router = useRouter();
const { signOut } = useAuth();

type Row = {
  name: string;
  paid: number;
  userId: number;
  drinks: string;
  rounds: number;
};

const selectedUsers = ref<Array<Row>>([]);

const value = ref(1);

const newGuestName = ref("");
const selectedMemberTab = ref<"member" | "guest">("member");
const selectedModeTab = ref<"drinks" | "rounds" | "paid">("drinks");

const members = await useFetch("/api/members", {
  query: {
    role: selectedMemberTab.value,
  },
});

watch(selectedMemberTab, async () => {
  members.data.value = await $fetch("/api/members", {
    query: {
      role: selectedMemberTab.value,
    },
  });
});

const submit = async () => {
  const uniqueMembers = Array.from(
    new Set(selectedUsers.value.map((obj) => obj.userId))
  ).map((userId) => {
    return selectedUsers.value.find((obj) => obj.userId === userId)!;
  });

  const response = await $fetch("/api/members", {
    method: "POST",
    query: {
      role: selectedMemberTab.value,
    },
    body: {
      users: uniqueMembers.map((user) => user.userId),
      value: value.value,
      mode: selectedModeTab.value,
    },
  });
  members.data.value = response;
  value.value = 1;
  selectedUsers.value = [];
};

const membersInOrder = computed(() => {
  return members.data.value
    ?.sort(
      (member1, member2) => Number(member2.drinks) - Number(member1.drinks)
    )
    .map((m) => ({ ...m, balance: m.paid - m.drinks }));
});

const addNewGuest = async () => {
  members.data.value = await $fetch("/api/guests", {
    method: "POST",
    body: {
      name: newGuestName.value,
    },
  });
};
</script>

<template>
  <div class="flex flex-col h-full">
    <div>
      <Tabs v-model="selectedMemberTab">
        <TabsList>
          <TabsTrigger value="member"> Mitglieder </TabsTrigger>
          <TabsTrigger value="guest"> Gäste </TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs v-model="selectedModeTab">
        <TabsList>
          <TabsTrigger value="drinks"> Getrunken </TabsTrigger>
          <TabsTrigger value="paid"> Bezahlt </TabsTrigger>
          <TabsTrigger value="rounds"> Runden </TabsTrigger>
        </TabsList>
      </Tabs>
      <!-- <UTabs :items="memberTabs" v-model="selectedMemberTab" class="m-5" /> -->
      <!-- <UTabs :items="tabs" v-model="selectedTab" class="m-5" /> -->
    </div>
    <div v-if="selectedUsers" class="flex flex-col h-full">
      <div
        v-if="selectedMemberTab === 'guest'"
        class="flex flex-col gap-3 items-center"
      >
        <Textarea v-model="newGuestName" type="text" class="w-full" />
        <button
          icon="material-symbols:add-2-rounded"
          :disabled="!newGuestName.length"
          @click="addNewGuest"
        >
          Gast hinzufügen
        </button>
      </div>

      <!-- <UTable
        v-model="selectedUsers"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'Keine Einträge',
        }"
        :rows="membersInOrder"
        :columns="colums"
        @select="select"
      /> -->
      <div class="flex flex-col gap-3 w-full items-center mt-5">
        <div class="flex gap-3">
          <input v-model="value" type="number" step="1" />
        </div>

        {{ membersInOrder }}
        <button @click="submit" :disabled="!selectedUsers.length" class="mt-2">
          <template v-if="value > 0"> + </template>

          {{ value }} {{ selectedModeTab }}
        </button>
      </div>
    </div>
    <div class="flex-1" />
    <footer class="flex justify-center items-center w-full p-3">
      <button @click="() => signOut({ callbackUrl: '/' })" variant="soft">
        Ausloggen
      </button>
    </footer>
  </div>
</template>
