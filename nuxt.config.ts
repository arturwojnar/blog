export default defineNuxtConfig({
  // https://github.com/nuxt-themes/alpine
  extends: "@nuxt-themes/alpine",
  css: ["~/assets/css/main.css"],
  modules: [
    // https://github.com/nuxt-modules/plausible
    "@nuxtjs/plausible",
    // https://github.com/nuxt/devtools
    "@nuxt/devtools",
  ],

  compatibilityDate: "2025-03-01",

  runtimeConfig: {
    FORMSPREE_URL: process.env.FORMSPREE_URL,
  },
});
