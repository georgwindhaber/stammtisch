import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@sidebase/nuxt-auth", "@nuxt/icon"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      title: "Kellerbierrunde",
    },
  },
  auth: {
    globalAppMiddleware: true,
    isEnabled: true,
    disableServerSideAuth: false,
    disableInternalRouting: true,
    baseURL: process.env.NUXT_AUTH_ORIGIN_URL
      ? `https://${process.env.NUXT_AUTH_ORIGIN_URL}/api/auth`
      : undefined,
    provider: {
      type: "authjs",
      trustHost: false,
      defaultProvider: "email",
      addDefaultCallbackUrl: true,
    },
    sessionRefresh: {
      enablePeriodically: 60 * 60 * 1000,
      enableOnWindowFocus: true,
    },
  },

  runtimeConfig: {
    authSecret: process.env.NUXT_AUTH_SECRET,
    googleClientId: process.env.NUXT_GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.NUXT_GOOGLE_CLIENT_SECRET,
  },

  compatibilityDate: "2025-02-15",
});
