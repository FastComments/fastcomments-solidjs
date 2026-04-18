import { createEffect } from 'solid-js';
import { FastCommentsCollabChatWidget, type FastCommentsCollabChatWidgetHandle } from 'fastcomments-solidjs';
import { useTheme } from '../theme';
import DemoChrome from './_DemoChrome';

const CODE = `import { FastCommentsCollabChatWidget } from 'fastcomments-solidjs';

export default function CollabChat() {
  let contentRef: HTMLDivElement | undefined;
  return (
    <>
      <article ref={contentRef}>
        <h2>Highlight any passage to pin a discussion.</h2>
        <p>Selection-anchored realtime chat inside your document.</p>
      </article>
      <FastCommentsCollabChatWidget
        tenantId="demo"
        urlId="solid-demo-collab-chat"
        targetRef={() => contentRef}
      />
    </>
  );
}`;

export default function CollabChat() {
  let contentRef: HTMLDivElement | undefined;
  const { isDark } = useTheme();
  let handle: FastCommentsCollabChatWidgetHandle | undefined;
  createEffect(() => handle?.update({ hasDarkBackground: isDark() }));

  return (
    <DemoChrome
      breadcrumb="Widgets / Collab Chat"
      title="Collab Chat"
      subtitle="Document-anchored realtime chat. Readers highlight any passage and open a thread pinned to that exact selection. Perfect for docs, drafts, and review flows."
      tags={[{ label: 'Tenant · demo', brand: true }]}
      code={CODE}
      codeLabel="CollabChat.tsx"
    >
      <div class="fc-stage__panel fc-stage__panel--light">
        <div
          ref={contentRef}
          style={{ 'font-family': 'Georgia, serif', color: 'var(--fc-light-panel-ink)', 'max-width': '64ch', margin: '0 auto 32px', 'line-height': '1.7', 'font-size': '17px' }}
        >
          <h2 style={{ 'font-family': 'var(--fc-display)', 'font-weight': 700, 'font-size': '28px', 'letter-spacing': '-0.02em', color: 'var(--fc-light-panel-ink)', 'margin-top': 0 }}>
            The Rise of Real-Time Collaboration
          </h2>
          <p>
            Real-time collaboration tools have transformed how teams work together. From shared documents to inline
            commenting, the ability to discuss content in context reduces miscommunication and speeds up
            decision-making.
          </p>
          <p>
            FastComments Collab Chat brings this experience to any web page. Users can highlight text and attach
            comments directly to it, creating threaded discussions tied to specific passages.
          </p>
        </div>
        <FastCommentsCollabChatWidget
          apiRef={(h) => (handle = h)}
          tenantId="demo"
          urlId="solid-demo-collab-chat"
          targetRef={() => contentRef}
          hasDarkBackground={isDark()}
        />
      </div>
    </DemoChrome>
  );
}
