export default defineNuxtConfig({
  // https://github.com/nuxt-themes/alpine
  extends: "@nuxt-themes/alpine",
  css: ["~/assets/css/main.css"],
  modules: [
    // https://github.com/nuxt-modules/plausible
    "@nuxtjs/plausible", // https://github.com/nuxt/devtools
    "@nuxt/devtools",
    "@nuxtjs/supabase",
    "@nuxtjs/sitemap",
    "@nuxt/image",
  ],

  // Color mode configuration - set default to light
  colorMode: {
    preference: "light", // default theme
    fallback: "light", // fallback theme if preference is not available
  },

  compatibilityDate: "2025-03-01",
  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      title: "Know-How Code by Artur Wojnar",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content:
            "Know-How Code by Artur Wojnar - Blog about software architecture, domain-driven design, and Node.js development.",
        },
        { name: "author", content: "Artur Wojnar" },
        {
          name: "keywords",
          content:
            "software architecture, domain driven design, nodejs, typescript, frameworkless",
        },
        { property: "og:type", content: "website" },
        { property: "og:title", content: "Know-How Code by Artur Wojnar" },
        {
          property: "og:description",
          content:
            "Know-How Code by Artur Wojnar - Blog about software architecture, domain-driven design, and Node.js development.",
        },
        { property: "og:image", content: "/logo.svg" },
        { property: "og:url", content: "https://www.knowhowcode.dev" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:creator", content: "@arturwojnar" },
        { name: "twitter:title", content: "Know-How Code by Artur Wojnar" },
        {
          name: "twitter:description",
          content:
            "Know-How Code by Artur Wojnar - Blog about software architecture, domain-driven design, and Node.js development.",
        },
        { name: "twitter:image", content: "/logo.svg" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/icons/favicon.ico" },
        { rel: "manifest", href: "/manifest.json" },
      ],
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Artur Wojnar",
            url: "https://www.knowhowcode.dev",
            jobTitle: "Solutions Architect",
            worksFor: {
              "@type": "Organization",
              name: "Independent Consultant",
            },
            sameAs: [
              "https://www.linkedin.com/in/arturwojnar/",
              "https://github.com/arturwojnar",
            ],
          }),
        },
      ],
    },
  },

  // Performance optimizations
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },

  // Image optimization
  image: {
    provider: "ipx",
    quality: 95,
    format: ["webp", "png", "jpg"],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    dir: "public",
  },

  // Enable experimental features for better performance
  experimental: {
    payloadExtraction: false,
  },

  // MDC configuration for syntax highlighting
  mdc: {
    highlight: {
      langs: ["sql"],
    },
  },

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
