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

  compatibilityDate: "2024-04-03",
  // plugins: ["~/plugins/supabase.js"],
  runtimeConfig: {
    FORMSPREE_URL: process.env.FORMSPREE_URL,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
  },
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
  },
});
