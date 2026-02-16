<script setup lang="ts">
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "reka-ui";
import MdButton from "~/components/material-design/md-button.vue";

const history = await useFetch("/api/history");

if (!history.data.value) {
  throw new Error("Failed to fetch history data");
}

const offset = ref(0);

const loadMore = async () => {
  offset.value++;
  const newData = await $fetch("/api/history", {
    query: {
      offset: offset.value,
    },
  });

  if (newData && history.data.value) {
    history.data.value.drinks.push(...newData.drinks);
    history.data.value.paid.push(...newData.paid);
    history.data.value.rounds.push(...newData.rounds);
  }
};

const rows = computed(() => {
  if (!history.data.value) {
    return [];
  }

  return [
    ...history.data.value.drinks.map((entry) => ({ ...entry, type: "drinks" })),
    ...history.data.value.paid.map((entry) => ({ ...entry, type: "paid" })),
    ...history.data.value.rounds.map((entry) => ({ ...entry, type: "rounds" })),
  ].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return dateB.getTime() - dateA.getTime();
  });
});

const deleteEntry = async (entryId: number, mode: string) => {
  await $fetch("/api/members", {
    method: "DELETE",
    body: {
      mode,
      entityId: entryId,
    },
  });

  history.refresh();
};
</script>

<template>
  <div class="flex flex-col divide-surface-container-highest w-full divide-y">
    <div v-for="entry of rows" class="flex gap-1 py-3 justify-between">
      <div>
        <div class="text-primary flex items-center gap-2">
          <icon
            v-if="entry.type === 'drinks'"
            name="tdesign:beer"
            class="text-lg"
          />
          <icon
            v-else-if="entry.type === 'paid'"
            name="material-symbols:euro-rounded"
            class="text-lg"
          />
          <icon
            v-else-if="entry.type === 'rounds'"
            name="material-symbols:groups-rounded"
            class="text-lg"
          />
          {{ entry.value }} -
          {{ entry.userName }}
        </div>
        <div class="text-secondary text-sm">
          {{ new Date(entry.createdAt).toLocaleString() }},

          {{ entry.createdByName }}
        </div>
      </div>

      <alert-dialog-root>
        <alert-dialog-trigger as-child>
          <button
            class="hover:cursor-pointer hover:bg-surface-container-high h-8 w-8 rounded-full flex justify-center items-center text-tertiary"
          >
            <icon name="material-symbols:more-vert" class="text-2xl" />
          </button>
        </alert-dialog-trigger>
        <alert-dialog-overlay
          class="backdrop-blur-xs bg-black/20 fixed inset-0 z-30"
        ></alert-dialog-overlay>
        <alert-dialog-content
          class="z-40 fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-125 -translate-x-1/2 -translate-y-1/2 bg-surface-container rounded-xl p-3"
        >
          <alert-dialog-title class="text-xl font-bold"
            >Eintrag wirklich löschen?</alert-dialog-title
          >

          <alert-dialog-description>
            <div class="my-4">
              <div class="text-primary flex items-center gap-2">
                <icon
                  v-if="entry.type === 'drinks'"
                  name="tdesign:beer"
                  class="text-lg"
                />
                <icon
                  v-else-if="entry.type === 'paid'"
                  name="material-symbols:euro-rounded"
                  class="text-lg"
                />
                <icon
                  v-else-if="entry.type === 'rounds'"
                  name="material-symbols:groups-rounded"
                  class="text-lg"
                />
                {{ entry.value }} -
                {{ entry.userName }}
              </div>
              <div class="text-secondary text-sm">
                {{ new Date(entry.createdAt).toLocaleString() }},

                {{ entry.createdByName }}
              </div>
            </div>
          </alert-dialog-description>
          <div class="flex justify-end gap-2">
            <alert-dialog-cancel as-child>
              <md-button theme="tonal"> Abbrechen </md-button>
            </alert-dialog-cancel>
            <alert-dialog-action as-child>
              <md-button @click="deleteEntry(entry.entryId, entry.type)">
                Löschen
              </md-button>
            </alert-dialog-action>
          </div>
        </alert-dialog-content>
      </alert-dialog-root>
    </div>
    <div class="flex justify-center my-4">
      <md-button
        theme="tonal"
        class="flex items-center justify-center gap-1"
        @click="loadMore"
      >
        <icon
          name="material-symbols:sim-card-download-outline-rounded"
          class="text-lg"
        />
        Mehr laden...
      </md-button>
    </div>
  </div>
</template>
