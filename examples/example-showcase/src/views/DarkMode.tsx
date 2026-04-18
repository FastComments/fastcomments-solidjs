import { createEffect, createSignal } from 'solid-js';
import { FastCommentsCommentWidget, type FastCommentsCommentWidgetHandle } from 'fastcomments-solidjs';
import { useTheme } from '../theme';
import DemoChrome from './_DemoChrome';

const CODE = `import { createEffect, createSignal } from 'solid-js';
import { FastCommentsCommentWidget, type FastCommentsCommentWidgetHandle } from 'fastcomments-solidjs';

export default function DarkMode() {
  const [isDark, setIsDark] = createSignal(false);
  let handle: FastCommentsCommentWidgetHandle | undefined;
  createEffect(() => handle?.update({ hasDarkBackground: isDark() }));
  return (
    <>
      <button onClick={() => setIsDark(false)}>Light</button>
      <button onClick={() => setIsDark(true)}>Dark</button>
      <FastCommentsCommentWidget
        apiRef={(h) => (handle = h)}
        tenantId="demo"
        urlId="solid-demo-dark"
        hasDarkBackground={isDark()}
      />
    </>
  );
}`;

export default function DarkMode() {
  const { isDark: themeIsDark } = useTheme();
  const [isDark, setIsDark] = createSignal(themeIsDark());
  let handle: FastCommentsCommentWidgetHandle | undefined;

  createEffect(() => {
    handle?.update({ hasDarkBackground: isDark() });
  });

  return (
    <DemoChrome
      breadcrumb="Flows / Dark Mode"
      title="Dark Mode"
      subtitle={<>Toggle the widget theme at runtime. The effect calls
        <code style={{ 'font-family': 'var(--fc-mono)', color: 'var(--fc-ink)', margin: '0 4px' }}>handle.update()</code>
        whenever the signal changes, pushing the new config into the live widget.</>}
      tags={[{ label: `Active · ${isDark() ? 'dark' : 'light'}`, brand: true }]}
      code={CODE}
      codeLabel="DarkMode.tsx"
    >
      <div class="fc-stage__panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', 'padding-bottom': '16px', 'box-shadow': 'inset 0 -1px 0 0 var(--fc-border)', 'margin-bottom': '20px' }}>
          <button class={`fc-btn${!isDark() ? ' fc-btn--primary' : ''}`} onClick={() => setIsDark(false)}>Light</button>
          <button class={`fc-btn${isDark() ? ' fc-btn--primary' : ''}`} onClick={() => setIsDark(true)}>Dark</button>
        </div>
        <div style={{
          padding: '24px',
          'border-radius': '12px',
          transition: 'background 250ms ease, color 250ms ease',
          background: isDark() ? '#0b0b0b' : '#ffffff',
          color: isDark() ? '#fff' : '#111',
        }}>
          <FastCommentsCommentWidget
            apiRef={(h) => (handle = h)}
            tenantId="demo"
            urlId="solid-demo-dark"
            hasDarkBackground={isDark()}
          />
        </div>
      </div>
    </DemoChrome>
  );
}
