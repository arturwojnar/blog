<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt';
</script>

<template>
  <AppLayout>
    <Analytics />
    <NuxtPage />
  </AppLayout>
</template>

<style>
html {
  font-family: $dt('font.sans');
}
</style>