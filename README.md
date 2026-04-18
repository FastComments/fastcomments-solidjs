# fastcomments-solidjs

[![npm version](https://img.shields.io/npm/v/fastcomments-solidjs.svg)](https://www.npmjs.com/package/fastcomments-solidjs)

A [SolidJS](https://www.solidjs.com/) library for [FastComments](https://fastcomments.com). Ports the official
[`fastcomments-react`](https://github.com/fastcomments/fastcomments-react) widgets to idiomatic Solid components.

## Install

```bash
npm install fastcomments-solidjs
```

## Usage

```tsx
import { FastCommentsCommentWidget } from 'fastcomments-solidjs';

export default function App() {
  return <FastCommentsCommentWidget tenantId="demo" urlId="some-page-id" />;
}
```

## Reacting to config changes (imperative handle)

Solid does not automatically track deep mutations on arbitrary objects, so
config changes after the first render must be pushed explicitly. Every widget
accepts an `apiRef` that returns a handle; call `handle.update(partial)` from
a `createEffect` to drive reactivity:

```tsx
import { createEffect, createSignal } from 'solid-js';
import { FastCommentsCommentWidget, type FastCommentsCommentWidgetHandle } from 'fastcomments-solidjs';

export default function Paginated() {
  const [page, setPage] = createSignal(0);
  let handle: FastCommentsCommentWidgetHandle | undefined;
  createEffect(() => handle?.update({ urlId: `product-${page()}` }));

  return (
    <>
      <button onClick={() => setPage(page() + 1)}>next</button>
      <FastCommentsCommentWidget
        apiRef={(h) => (handle = h)}
        tenantId="demo"
        urlId={`product-${page()}`}
      />
    </>
  );
}
```

`update()` is safe to call at any time:
- Before the script has loaded: the partial is stashed and applied at init.
- During an async init (reviews-summary, user-activity-feed): the partial is queued and applied when the callback resolves.
- After init: it forwards straight to the live widget's `.update()` method.

### Imperative handle API

```ts
interface WidgetHandle<Config> {
  getInstance: () => WidgetInstance | null;   // latest live instance (or null before mount)
  onInstance: (cb: (instance: WidgetInstance) => void) => void; // fires once instance is ready
  update: (partial: Partial<Config>) => void; // merge-and-push config
}
```

Use `getInstance()` for imperative actions that aren't covered by `.update()`, e.g. `openProfile`:

```tsx
const openProfile = () =>
  (handle?.getInstance() as { openProfile?: (o: { userId: string }) => void } | null)
    ?.openProfile?.({ userId: 'demo' });
```

## Components

Every widget from `fastcomments-react` is available under the same name:

| Component | Handle type | Embed loaded |
| --- | --- | --- |
| `FastCommentsCommentWidget` | `FastCommentsCommentWidgetHandle` | Flagship live commenting widget |
| `FastCommentsCommentCountWidget` | `FastCommentsCommentCountWidgetHandle` | Inline comment-count badge |
| `FastCommentsLiveChatWidget` | `FastCommentsLiveChatWidgetHandle` | Streaming live-chat widget |
| `FastCommentsCollabChatWidget` | `FastCommentsCollabChatWidgetHandle` | Text-anchored collaborative chat |
| `FastCommentsImageChatWidget` | `FastCommentsImageChatWidgetHandle` | Region-based image comments |
| `FastCommentsRecentCommentsWidget` | `FastCommentsRecentCommentsWidgetHandle` | Recent-comments feed |
| `FastCommentsRecentDiscussionsWidget` | `FastCommentsRecentDiscussionsWidgetHandle` | Recent-discussions feed |
| `FastCommentsReviewsSummaryWidget` | `FastCommentsReviewsSummaryWidgetHandle` | Star-rating summary |
| `FastCommentsTopPagesWidget` | `FastCommentsTopPagesWidgetHandle` | Top-commented pages leaderboard |
| `FastCommentsUserActivityFeedWidget` | `FastCommentsUserActivityFeedWidgetHandle` | Per-user activity timeline |

### Widgets that attach to an existing element

`FastCommentsCollabChatWidget` and `FastCommentsImageChatWidget` mount into a caller-supplied
element. Pass a `targetRef` accessor that returns the element once mounted:

```tsx
import { FastCommentsImageChatWidget } from 'fastcomments-solidjs';

export default function ImageChat() {
  let img: HTMLImageElement | undefined;
  return (
    <>
      <img ref={img} src="/screenshot.png" alt="" />
      <FastCommentsImageChatWidget
        tenantId="demo"
        urlId="my-image"
        targetRef={() => img}
      />
    </>
  );
}
```

### Regions

Pass `region="eu"` to route widget traffic through the EU cluster.

## Showcase

A full showcase app lives in `examples/example-showcase/`. It mirrors the React showcase and covers every
widget plus common flows (dark mode, pagination, SSO, callbacks).

```bash
cd examples/example-showcase
npm install
npm run dev
```

## Build

```bash
npm install
npm run build       # library -> dist/
npm test            # vitest smoke test
npm run build:demo  # showcase -> demo-dist/
```

## License

MIT
