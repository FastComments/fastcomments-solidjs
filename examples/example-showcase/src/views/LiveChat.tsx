import { createEffect } from 'solid-js';
import { FastCommentsLiveChatWidget, type FastCommentsLiveChatWidgetHandle } from 'fastcomments-solidjs';
import { useTheme } from '../theme';
import DemoChrome from './_DemoChrome';

const CODE = `import { FastCommentsLiveChatWidget } from 'fastcomments-solidjs';

export default function LiveChat() {
  return <FastCommentsLiveChatWidget tenantId="demo" urlId="solid-demo-live-chat" />;
}`;

export default function LiveChat() {
  const { isDark } = useTheme();
  let handle: FastCommentsLiveChatWidgetHandle | undefined;
  createEffect(() => handle?.update({ hasDarkBackground: isDark() }));
  return (
    <DemoChrome
      breadcrumb="Widgets / Live Chat"
      title="Live Chat"
      subtitle="The streaming flavor of the core widget. Tuned for live events, launches, and broadcasts where message volume would overwhelm a threaded view."
      tags={[{ label: 'Tenant · demo', brand: true }, { label: 'Mode · streaming' }]}
      code={CODE}
      codeLabel="LiveChat.tsx"
    >
      <div class="fc-stage__panel fc-stage__panel--light">
        <FastCommentsLiveChatWidget apiRef={(h) => (handle = h)} tenantId="demo" urlId="solid-demo-live-chat" hasDarkBackground={isDark()} />
      </div>
    </DemoChrome>
  );
}
