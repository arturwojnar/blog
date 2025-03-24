export default defineNuxtConfig({
  // https://github.com/nuxt-themes/alpine
  extends: "@nuxt-themes/alpine",
  css: ["~/assets/css/main.css"],
  modules: [
    // https://github.com/nuxt-modules/plausible
    "@nuxtjs/plausible", // https://github.com/nuxt/devtools
    "@nuxt/devtools",
    "@nuxtjs/supabase",
  ],
  supabase: {
    // Disable redirect completely
    redirectOptions: {
      login: false,
      callback: false,
      exclude: ["/**"],
    },
    // This is important - set the correct client options
    clientOptions: {
      auth: {
        persistSession: false, // Don't persist the session during SSR
      },
    },
  },
  nitro: {
    preset: "vercel",
    prerender: {
      failOnError: false,
    },
  },
  runtimeConfig: {
    FORMSPREE_URL: process.env.FORMSPREE_URL,
  },
});
