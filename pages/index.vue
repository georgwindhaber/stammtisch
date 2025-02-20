<script setup lang="ts">
definePageMeta({
  auth: false,
});

const drinks = useFetch("/api/drinks");
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center p-24">
    <div>
      <h1 class="text-3xl text-center font-bold mb-5">Kellerbierrunde</h1>
      <img
        src="/logo.png"
        class="dark:invert"
        width="300"
        height="300"
        priority
        alt="logo"
      />
      <div class="mt-7 text-center italic">
        Konsumiert:
        {{ drinks.data.value?.find((d) => d.role === "member")?.value || 0 }}
        <br />
        Gäste:
        {{ drinks.data.value?.find((d) => d.role === "guest")?.value || 0 }}
      </div>
    </div>
    <NuxtLink class="fixed bottom-5" to="/app"> Zur App </NuxtLink>
  </main>
</template>
