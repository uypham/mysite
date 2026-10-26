import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";

const root = import.meta.dirname;

// Old iPhones: keep both bundles free of ?. ?? ||= (checked by scripts/check-legacy-syntax.js).
const LEGACY_TARGETS = ["defaults", "iOS >= 9", "safari >= 9"];
const MODERN_TARGETS = [
  "chrome >= 64",
  "edge >= 79",
  "firefox >= 67",
  "safari >= 12",
  "iOS >= 12",
];

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: LEGACY_TARGETS,
      modernTargets: MODERN_TARGETS,
    }),
  ],
  server: { port: 1234, open: true },
  build: {
    rollupOptions: {
      input: {
        index: resolve(root, "index.html"),
        bio: resolve(root, "bio.html"),
        notFound: resolve(root, "404.html"),
        giaVang: resolve(root, "gia-vang.html"),
        lichCongGiao: resolve(root, "lich-cong-giao.html"),
        lichCongGiaoPrivacy: resolve(root, "lich-cong-giao/privacy.html"),
        lichCongGiaoSupport: resolve(root, "lich-cong-giao/support.html"),
      },
    },
  },
});
