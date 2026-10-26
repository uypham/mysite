import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";
import react from "@vitejs/plugin-react";

const root = join(import.meta.dirname, "..");
const distDir = join(root, "dist");
const ssrOutDir = join(root, "node_modules", ".cache", "prerender");
const EMPTY_ROOT = '<div id="root"></div>';
// React 19 emits resource hints (e.g. image preloads) ahead of the markup; they belong in <head>.
const LEADING_LINKS = /^(?:<link [^>]*\/>)+/;

// Standalone config: the client config's HTML inputs and legacy plugin don't apply to SSR.
await build({
  configFile: false,
  root,
  logLevel: "warn",
  plugins: [react()],
  build: { ssr: "src/entry-server.jsx", outDir: ssrOutDir, emptyOutDir: true },
});

const { renderPages } = await import(pathToFileURL(join(ssrOutDir, "entry-server.js")).href);

for (const { file, markup } of renderPages()) {
  const htmlPath = join(distDir, file);
  const html = readFileSync(htmlPath, "utf8");
  if (!html.includes(EMPTY_ROOT)) throw new Error(`${file}: missing ${EMPTY_ROOT}`);
  const [links = ""] = markup.match(LEADING_LINKS) || [];
  const body = markup.slice(links.length);
  const prerendered = html
    .replace("</head>", `${links}</head>`)
    .replace(EMPTY_ROOT, `<div id="root">${body}</div>`);
  writeFileSync(htmlPath, prerendered);
  console.log(`✓ prerendered ${file} (${body.length} chars)`);
}

rmSync(ssrOutDir, { recursive: true, force: true });
