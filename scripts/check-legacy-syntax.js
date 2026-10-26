import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { parse } from "acorn";
import { simple } from "acorn-walk";

const distDir = join(import.meta.dirname, "..", "dist");

const listJsFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) return listJsFiles(fullPath);
    return entry.name.endsWith(".js") ? [fullPath] : [];
  });

const findForbiddenSyntax = (code) => {
  const found = new Set();
  // ES2020 still allows dynamic import() in modern chunks; ||= &&= ??= (ES2021) fail to parse.
  const ast = parse(code, { ecmaVersion: 2020, sourceType: "module" });
  simple(ast, {
    ChainExpression: () => found.add("?."),
    LogicalExpression: (node) => {
      if (node.operator === "??") found.add("??");
    },
  });
  return [...found];
};

const htmlFiles = readdirSync(distDir).filter((name) => name.endsWith(".html"));
const inlineScripts = htmlFiles.flatMap((name) => {
  const html = readFileSync(join(distDir, name), "utf8");
  const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)];
  return scripts.map((match, index) => ({ label: `${name} <script #${index}>`, code: match[1] }));
});
const jsFiles = listJsFiles(distDir).map((file) => ({
  label: relative(distDir, file),
  code: readFileSync(file, "utf8"),
}));

const failures = [...jsFiles, ...inlineScripts].flatMap(({ label, code }) => {
  try {
    const forbidden = findForbiddenSyntax(code);
    return forbidden.length ? [`${label}: ${forbidden.join(" ")}`] : [];
  } catch (error) {
    return [`${label}: ${error.message}`];
  }
});

if (failures.length) {
  console.error("✗ Syntax old Safari cannot parse:\n" + failures.join("\n"));
  process.exit(1);
}
console.log(`✓ ${jsFiles.length} JS files + ${inlineScripts.length} inline scripts are old-Safari safe`);
