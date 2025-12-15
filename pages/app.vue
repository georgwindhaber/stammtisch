<script setup lang="ts">
import MdTab from "~/components/material-design/md-tab.vue";

const { signOut, data } = useAuth();

export type Member = {
  name: string;
  paid: number;
  userId: number;
  drinks: string;
  rounds: number;
};

const router = useRouter();
const route = useRoute();
if (route.name === "app") {
  router.replace({ name: "members" });
}
</script>

<template>
  <div class="flex flex-col h-full bg-surface text-on-surface">
    <div
      class="flex w-full justify-center items-center mt-5 max-w-[400px] px-3 mx-auto"
    >
      <md-tab :to="{ name: 'members' }" replace>
        <icon name="material-symbols:award-star-rounded" />
        Mitglieder
      </md-tab>
      <md-tab :to="{ name: 'guests' }" replace>
        <icon name="material-symbols:family-restroom-rounded" />
        Gäste
      </md-tab>
      <md-tab :to="{ name: 'app-history' }" replace>
        <icon name="material-symbols:history-rounded" />
        Verlauf
      </md-tab>
    </div>
    <div class="flex flex-col">
      <div
        class="flex flex-col gap-3 w-full items-center mt-5 max-w-[400px] px-3 mx-auto"
      >
        <nuxt-page />
      </div>
    </div>
    <div class="flex-1" />
    <footer class="flex justify-center items-center w-full p-3 mt-8">
      <button
        @click="() => signOut({ callbackUrl: '/' })"
        variant="soft"
        class="flex justify-center items-center gap-3"
      >
        <img
          v-if="data?.user?.image"
          :src="data.user.image"
          class="rounded-full size-8"
        />
        Ausloggen
      </button>
    </footer>
  </div>
</template>
