<script setup lang="ts">
import MdButton from "~/components/material-design/md-button.vue";

const route = useRoute();
const router = useRouter();
const { signOut } = useAuth();

export type Member = {
  name: string;
  paid: number;
  userId: number;
  drinks: string;
  rounds: number;
};

const selectedUsersId = ref<Array<Member["userId"]>>([]);

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
  const response = await $fetch("/api/members", {
    method: "POST",
    query: {
      role: selectedMemberTab.value,
    },
    body: {
      users: selectedUsersId.value,
      value: value.value,
      mode: selectedModeTab.value,
    },
  });
  members.data.value = response;
  value.value = 1;
  selectedUsersId.value = [];
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

const toggleMember = (member: Member) => {
  if (selectedUsersId.value.includes(member.userId)) {
    selectedUsersId.value = selectedUsersId.value.filter(
      (m) => m !== member.userId
    );
  } else {
    selectedUsersId.value.push(member.userId);
  }
};
</script>

<template>
  <div class="flex flex-col h-full bg-surface text-on-surface">
    <div>
      <!-- <Tabs v-model="selectedMemberTab">
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
      </Tabs> -->
      <!-- <UTabs :items="memberTabs" v-model="selectedMemberTab" class="m-5" /> -->
      <!-- <UTabs :items="tabs" v-model="selectedTab" class="m-5" /> -->
    </div>
    <div v-if="selectedUsersId" class="flex flex-col h-full">
      <div
        v-if="selectedMemberTab === 'guest'"
        class="flex flex-col gap-3 items-center"
      >
        <textarea v-model="newGuestName" type="text" class="w-full" />
        <md-button
          icon="material-symbols:add-2-rounded"
          :disabled="!newGuestName.length"
          @click="addNewGuest"
        >
          Gast hinzufügen
        </md-button>
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

        <section class="flex flex-col gap-3 w-full max-w-[400px] px-3">
          <st-member
            v-for="member of membersInOrder"
            :member="member"
            :selected="selectedUsersId.includes(member.userId)"
            @click="toggleMember(member)"
          />
        </section>

        <md-button
          @click="submit"
          :disabled="!selectedUsersId.length"
          class="mt-2"
        >
          <template v-if="value > 0"> + </template>

          {{ value }} {{ selectedModeTab }}
        </md-button>
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
