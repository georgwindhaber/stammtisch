<script setup lang="ts">
import MdButton from "~/components/material-design/md-button.vue";
import MdIconButton from "~/components/material-design/md-icon-button.vue";
import MdNumber from "~/components/material-design/md-number.vue";
import type { Member } from "~/pages/app.vue";

const props = defineProps<{
  type: "member" | "guest";
}>();

const emit = defineEmits<{
  (e: "user-select", selectedUsersId: Array<Member["userId"]>): void;
}>();

const value = ref(1);
const selectedUsersId = ref<Array<Member["userId"]>>([]);

const members = await useFetch("/api/members", {
  query: {
    role: props.type,
  },
});

const newGuestName = ref("");
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

const submit = async (mode: string) => {
  const cloneUserIds = [...selectedUsersId.value];
  selectedUsersId.value = [];

  const response = await $fetch("/api/members", {
    method: "POST",
    query: {
      role: props.type,
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

const toggleMember = (member: Member) => {
  if (selectedUsersId.value.includes(member.userId)) {
    selectedUsersId.value = selectedUsersId.value.filter(
      (m) => m !== member.userId
    );
  } else {
    selectedUsersId.value.push(member.userId);
  }

  emit("user-select", selectedUsersId.value);
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
  <section
    class="flex flex-col w-full divide-surface-container-highest divide-y-1"
  >
    <st-member
      v-for="(member, index) of membersInOrder"
      :order="index + 1"
      :member="member"
      :selected="selectedUsersId.includes(member.userId)"
      @click="toggleMember(member)"
    />
  </section>

  <div class="flex gap-3 w-full mt-5">
    <md-icon-button icon="material-symbols:remove-rounded" @click="value--" />
    <md-number
      v-model="value"
      type="number"
      step="1"
      class="flex-1 min-w-12 max-w-auto"
    />
    <md-icon-button icon="material-symbols:add-2-rounded" @click="value++" />
  </div>

  <div class="flex gap-1 justify-between w-full">
    <md-button
      @click="submit('rounds')"
      :disabled="!selectedUsersId.length"
      theme="tonal"
      class="mt-2 flex justify-center leading-0 gap-2 items-center"
    >
      <template v-if="value > 0"> + </template>
      {{ value }}
      <icon name="material-symbols:groups-rounded" class="text-lg" />
    </md-button>
    <md-button
      @click="submit('paid')"
      :disabled="!selectedUsersId.length"
      theme="tonal"
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
    v-if="type === 'guest'"
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
</template>
