import { createEffect } from 'solid-js';
import { FastCommentsCommentWidget, type FastCommentsCommentWidgetHandle } from 'fastcomments-solidjs';
import { useTheme } from '../theme';
import DemoChrome from './_DemoChrome';

const CODE = `import { FastCommentsCommentWidget, type FastCommentsCommentWidgetHandle } from 'fastcomments-solidjs';

export default function OpenProfile() {
  let handle: FastCommentsCommentWidgetHandle | undefined;
  const openProfile = () =>
    (handle?.getInstance() as { openProfile?: (o: { userId: string }) => void } | null)
      ?.openProfile?.({ userId: 'demo' });
  return (
    <>
      <button onClick={openProfile}>Open profile</button>
      <FastCommentsCommentWidget apiRef={(h) => (handle = h)} tenantId="demo" urlId="solid-demo" />
    </>
  );
}`;

export default function OpenProfile() {
  let handle: FastCommentsCommentWidgetHandle | undefined;
  const { isDark } = useTheme();
  createEffect(() => handle?.update({ hasDarkBackground: isDark() }));

  const openProfile = () => {
    const instance = handle?.getInstance() as
      | { openProfile?: (o: { userId: string }) => void }
      | null;
    instance?.openProfile?.({ userId: 'demo' });
  };

  return (
    <DemoChrome
      breadcrumb="Flows / Open Profile"
      title="Open User Profile Programmatically"
      subtitle="Reach into the widget’s imperative API to open the user-profile drawer from anywhere in your app. Perfect for custom @-mention pickers, admin actions, or support flows."
      tags={[{ label: 'API · imperative', brand: true }]}
      code={CODE}
      codeLabel="OpenProfile.tsx"
    >
      <div class="fc-stage__panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', 'padding-bottom': '16px', 'box-shadow': 'inset 0 -1px 0 0 var(--fc-border)', 'margin-bottom': '20px' }}>
          <button class="fc-btn fc-btn--primary" onClick={openProfile}>Open example profile</button>
        </div>
        <div class="fc-stage__panel fc-stage__panel--light" style={{ padding: '20px' }}>
          <FastCommentsCommentWidget
            apiRef={(h) => (handle = h)}
            tenantId="demo"
            urlId="solid-demo-open-profile"
            hasDarkBackground={isDark()}
          />
        </div>
      </div>
    </DemoChrome>
  );
}
