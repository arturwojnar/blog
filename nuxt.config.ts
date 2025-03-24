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

  compatibilityDate: "2025-03-01",

  supabase: {
    // Set redirect to false directly
    redirect: false,
    // Important for Vercel deployment
    clientOptions: {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  },
  runtimeConfig: {
    FORMSPREE_URL: process.env.FORMSPREE_URL,
  },
});
