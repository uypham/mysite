import { defineConfig } from "astro/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  site: "https://uypham.com",
  markdown: {
    syntaxHighlight: false,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
