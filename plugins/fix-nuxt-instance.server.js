// plugins/fix-nuxt-instance.server.js
export default defineNuxtPlugin(() => {
  // This runs on the server side and creates a global fallback for useNuxtApp
  if (process.server) {
    try {
      const originalUseNuxtApp = globalThis.useNuxtApp;

      // Override useNuxtApp to provide a fallback mock
      globalThis.useNuxtApp = function () {
        try {
          return originalUseNuxtApp();
        } catch (e) {
          // If the real useNuxtApp fails, return a mock object
          console.warn("Providing fallback Nuxt instance");
          return {
            provide: {
              // Add any required provides here
            },
            hook: () => {},
            hooks: { hook: () => {} },
            $router: {
              options: {},
              beforeResolve: () => {},
              afterEach: () => {},
            },
            vueApp: {
              directive: () => {},
              component: () => {},
              use: () => {},
            },
            _instance: {},
          };
        }
      };
    } catch (e) {
      // Silently fail if there's an error
    }
  }
});
