import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://uypham.com",
  integrations: [mdx(), sitemap()],
  markdown: {
    syntaxHighlight: false,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  server: {
    // port: 4321,
    // https://www.joshwcomeau.com/css/custom-css-reset/#the-css-reset-1
    open: true,
  },
});
