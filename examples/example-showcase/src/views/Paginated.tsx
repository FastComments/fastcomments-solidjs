import { createEffect, createSignal } from 'solid-js';
import { FastCommentsCommentWidget, type FastCommentsCommentWidgetHandle } from 'fastcomments-solidjs';
import { useTheme } from '../theme';
import DemoChrome from './_DemoChrome';

const CODE = `import { createEffect, createSignal } from 'solid-js';
import { FastCommentsCommentWidget, type FastCommentsCommentWidgetHandle } from 'fastcomments-solidjs';

export default function Paginated() {
  const [page, setPage] = createSignal(0);
  let handle: FastCommentsCommentWidgetHandle | undefined;
  createEffect(() => handle?.update({ urlId: \`product-\${page()}\` }));
  return (
    <>
      <button onClick={() => setPage(page() - 1)}>Prev</button>
      <button onClick={() => setPage(page() + 1)}>Next</button>
      <FastCommentsCommentWidget
        apiRef={(h) => (handle = h)}
        tenantId="demo"
        urlId={\`product-\${page()}\`}
      />
    </>
  );
}`;

export default function Paginated() {
  const [page, setPage] = createSignal(0);
  const { isDark } = useTheme();
  const urlId = () => `solid-demo-page-${page()}`;
  let handle: FastCommentsCommentWidgetHandle | undefined;

  createEffect(() => {
    handle?.update({ urlId: urlId(), hasDarkBackground: isDark() });
  });

  return (
    <DemoChrome
      breadcrumb="Flows / Thread Pagination"
      title="Thread Pagination"
      subtitle={<>Swap the widget’s
        <code style={{ 'font-family': 'var(--fc-mono)', color: 'var(--fc-ink)', margin: '0 4px' }}>urlId</code>
        at runtime via the imperative handle. No remount. Threads provision lazily on the server.</>}
      tags={[{ label: `Page · ${page()}`, brand: true }, { label: `urlId · ${urlId()}` }]}
      code={CODE}
      codeLabel="Paginated.tsx"
    >
      <div class="fc-stage__panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', 'align-items': 'center', gap: '10px', 'padding-bottom': '14px', 'box-shadow': 'inset 0 -1px 0 0 var(--fc-border)', 'margin-bottom': '20px', 'flex-wrap': 'wrap' }}>
          <button class="fc-btn" onClick={() => setPage(page() - 1)}>← prev</button>
          <button class="fc-btn fc-btn--primary" onClick={() => setPage(page() + 1)}>next →</button>
          <div style={{ 'font-family': 'var(--fc-mono)', 'font-size': '13px', color: 'var(--fc-ink-dim)', 'margin-left': 'auto' }}>
            <span style={{ color: 'var(--fc-ink-mute)' }}>page </span>
            <span style={{ color: 'var(--fc-ink)' }}>{page()}</span>
          </div>
        </div>
        <div class="fc-stage__panel fc-stage__panel--light" style={{ padding: '20px' }}>
          <FastCommentsCommentWidget
            apiRef={(h) => (handle = h)}
            tenantId="demo"
            urlId={urlId()}
            hasDarkBackground={isDark()}
          />
        </div>
      </div>
    </DemoChrome>
  );
}
