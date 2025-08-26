// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-08-26",
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  ssr: false,
  app: {
    baseURL: "/resume-pilot/",
    head: {
      link: [{ rel: "icon", href: "/resume-pilot/favicon.ico" }],
    },
  },
  nitro: {
    prerender: {
      routes: ["/"],
    },
  },
  colorMode: {
    preference: "dark",
  },
});
