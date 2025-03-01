<script setup lang="ts">
import MdButton from "~/components/material-design/md-button.vue";
import MdIconButton from "~/components/material-design/md-icon-button.vue";
import MdNumber from "~/components/material-design/md-number.vue";
import MdTab from "~/components/material-design/md-tab.vue";

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
const currentTab = ref<"member" | "guest" | "history">("member");

const members = await useFetch("/api/members", {
  query: {
    role: currentTab.value,
  },
});

watch(currentTab, async () => {
  members.data.value = await $fetch("/api/members", {
    query: {
      role: currentTab.value,
    },
  });
});

const submit = async (mode: string) => {
  const cloneUserIds = [...selectedUsersId.value];
  selectedUsersId.value = [];

  const response = await $fetch("/api/members", {
    method: "POST",
    query: {
      role: currentTab.value,
    },
    body: {
      users: cloneUserIds,
      value: value.value,
      mode: mode,
    },
  });
  members.data.value = response;
  value.value = 1;
};

const membersInOrder = computed(() => {
  return members.data.value
    ?.sort(
      (member1, member2) => Number(member2.drinks) - Number(member1.drinks)
    )
    .map((m) => ({ ...m, balance: m.paid - m.drinks }));
});

const addNewGuest = async () => {
  const newGuestNameClone = newGuestName.value;
  newGuestName.value = "";
  members.data.value = await $fetch("/api/guests", {
    method: "POST",
    body: {
      name: newGuestNameClone,
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
    <div
      class="flex w-full justify-center items-center mt-5 max-w-[400px] px-3 mx-auto"
    >
      <md-tab
        :selected="currentTab === 'member'"
        @click="currentTab = 'member'"
      >
        <icon name="material-symbols:award-star-rounded" />
        Mitglieder
      </md-tab>
      <md-tab :selected="currentTab === 'guest'" @click="currentTab = 'guest'">
        <icon name="material-symbols:family-restroom-rounded" />
        Gäste
      </md-tab>
      <!-- <md-tab
        :selected="currentTab === 'history'"
        @click="currentTab = 'history'"
      >
        <icon name="material-symbols:history-rounded" />
        Verlauf
      </md-tab> -->
    </div>
    <div v-if="selectedUsersId" class="flex flex-col h-full">
      <div
        class="flex flex-col gap-3 w-full items-center mt-5 max-w-[400px] px-3 mx-auto"
      >
        <section class="flex flex-col gap-3 w-full">
          <st-member
            v-for="member of membersInOrder"
            :member="member"
            :selected="selectedUsersId.includes(member.userId)"
            @click="toggleMember(member)"
          />
        </section>

        <div class="flex gap-3 w-full">
          <md-icon-button
            icon="material-symbols:remove-rounded"
            @click="value--"
          />
          <md-number
            v-model="value"
            type="number"
            step="1"
            class="flex-1 min-w-12 max-w-auto"
          />
          <md-icon-button
            icon="material-symbols:add-2-rounded"
            @click="value++"
          />
        </div>

        <div class="flex gap-1 justify-between w-full">
          <md-button
            @click="submit('rounds')"
            :disabled="!selectedUsersId.length"
            class="mt-2 flex justify-center leading-0 gap-2 items-center"
          >
            <template v-if="value > 0"> + </template>
            {{ value }}
            <icon name="material-symbols:groups-rounded" class="text-lg" />
          </md-button>
          <md-button
            @click="submit('paid')"
            :disabled="!selectedUsersId.length"
            class="mt-2 flex justify-center leading-0 gap-2 items-center"
          >
            <template v-if="value > 0"> + </template>
            {{ value }}
            <icon
              name="material-symbols:euro-rounded"
              class="text-md translate-y-[1px]"
            />
          </md-button>
          <md-button
            @click="submit('drinks')"
            :disabled="!selectedUsersId.length"
            class="mt-2 flex justify-center leading-0 gap-2 items-center"
          >
            <template v-if="value > 0"> + </template>
            {{ value }}
            <icon name="tdesign:beer" class="translate-y-[1px]" />
          </md-button>
        </div>

        <div
          v-if="currentTab === 'guest'"
          class="flex flex-col gap-3 mt-5 items-center w-full"
        >
          <material-design-md-text
            v-model="newGuestName"
            type="text"
            class="w-full"
          />
          <md-button
            icon="material-symbols:add-2-rounded"
            :disabled="!newGuestName.length"
            @click="addNewGuest"
          >
            Gast hinzufügen
          </md-button>
        </div>
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
