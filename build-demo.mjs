#!/usr/bin/env node
// Builds the canonical static demo for fastcomments-solidjs (example-showcase).
// Output ends up at <repo-root>/demo-dist/. Vite `base: './'` produces
// relative URLs so the bundle works under any path prefix.
import { execSync } from 'node:child_process';
import { renameSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DEMO_DIR = resolve(ROOT, 'examples/example-showcase');
const OUT = resolve(ROOT, 'demo-dist');

const sh = (cmd, cwd = ROOT) => {
  console.log('$', cmd, `(${cwd})`);
  execSync(cmd, { stdio: 'inherit', cwd });
};

sh('npm install');
sh('npm run build');
sh('npm install', DEMO_DIR);
sh('npm run build', DEMO_DIR);

rmSync(OUT, { recursive: true, force: true });
renameSync(resolve(DEMO_DIR, 'dist'), OUT);
console.log('Built fastcomments-solidjs demo at', OUT);
