# Contributing

## Dev workflow

```bash
npm install
npm test          # vitest smoke test (exports)
npm run build     # library build -> dist/
```

To iterate on the showcase demo against the local source:

```bash
cd examples/example-showcase
npm install       # pulls fastcomments-solidjs from `file:../..`
npm run dev       # vite dev server
```

Rebuild the library (`npm run build` at the repo root) and re-run `npm install` in the showcase
directory to pick up source changes in the published bundle.

## Widget parity

The library is a thin wrapper around the remote `cdn.fastcomments.com` embeds. Exact script URLs,
global names, and DOM id prefixes must match the upstream [`fastcomments-react`](https://github.com/fastcomments/fastcomments-react)
source; diff against it when adding new widgets.

## Releasing the demo

```bash
npm run build:demo   # produces demo-dist/
```

`demo-dist/index.html` is a static bundle safe to host anywhere (Vite `base: './'` keeps URLs relative).
