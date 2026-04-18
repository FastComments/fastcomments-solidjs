#!/usr/bin/env node
// Post-build: rewrite relative imports in dist/source/ to use explicit file
// extensions. tsc --jsx preserve emits extensionless specifiers, which Vite
// handles but strict Node ESM and some bundlers do not.
import { readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIR = resolve(ROOT, '../dist/source');

function collect(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = resolve(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) collect(full, out);
    else if (name.endsWith('.js') || name.endsWith('.jsx')) out.push(full);
  }
  return out;
}

const FILENAMES = new Map();
function loadFilenames() {
  for (const file of collect(DIR)) {
    const rel = file.slice(DIR.length + 1);
    const key = rel.replace(/\.(js|jsx)$/, '');
    FILENAMES.set(key, rel);
  }
}

function rewriteImports(code, fromDir) {
  // Matches: import ... from "./x"; export * from './x'; import('./x')
  const RE = /((?:import|export)\s+(?:[^'"]*?\s+from\s+)?|import\(\s*)(['"])(\.\.?\/[^'"]+?)(['"])/g;
  return code.replace(RE, (match, prefix, q1, spec, q2) => {
    if (/\.(m?jsx?|json|css)$/.test(spec)) return match; // already has extension
    const absTarget = resolve(fromDir, spec);
    const rel = absTarget.slice(DIR.length + 1);
    const mapped = FILENAMES.get(rel);
    if (!mapped) return match;
    const ext = mapped.endsWith('.jsx') ? '.jsx' : '.js';
    return `${prefix}${q1}${spec}${ext}${q2}`;
  });
}

loadFilenames();
for (const file of collect(DIR)) {
  const src = readFileSync(file, 'utf8');
  const out = rewriteImports(src, dirname(file));
  if (out !== src) {
    writeFileSync(file, out);
    console.log('rewrote', file.slice(DIR.length + 1));
  }
}
