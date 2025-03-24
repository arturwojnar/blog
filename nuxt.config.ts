export default defineNuxtConfig({
  // https://github.com/nuxt-themes/alpine
  extends: "@nuxt-themes/alpine",
  css: ["~/assets/css/main.css"],
  modules: [
    // https://github.com/nuxt-modules/plausible
    "@nuxtjs/plausible", // https://github.com/nuxt/devtools
    "@nuxt/devtools",
    // "@nuxtjs/supabase",
  ],
  // supabase: {
  //   // Set redirect to false directly
  //   redirect: false,
  //   // Also set redirectOptions to be safe
  //   redirectOptions: {
  //     login: false,
  //     callback: false,
  //     exclude: ["/**"],
  //   },
  //   // Important for Vercel deployment
  //   clientOptions: {
  //     auth: {
  //       persistSession: false,
  //       autoRefreshToken: false,
  //       detectSessionInUrl: false,
  //     },
  //   },
  // },
  // nitro: {
  //   preset: "vercel",
  //   prerender: {
  //     failOnError: false,
  //   },
  // },
  // routeRules: {
  //   // This would disable SSR for blog routes, adjust as needed
  //   "/**": { ssr: false },
  // },
  runtimeConfig: {
    FORMSPREE_URL: process.env.FORMSPREE_URL,
  },
});
