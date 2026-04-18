import { createEffect } from 'solid-js';
import { FastCommentsImageChatWidget, type FastCommentsImageChatWidgetHandle } from 'fastcomments-solidjs';
import { useTheme } from '../theme';
import DemoChrome from './_DemoChrome';

const CODE = `import { FastCommentsImageChatWidget } from 'fastcomments-solidjs';

export default function ImageChat() {
  let imgRef: HTMLImageElement | undefined;
  return (
    <>
      <img ref={imgRef} src="/demo.jpg" alt="" />
      <FastCommentsImageChatWidget
        tenantId="demo"
        urlId="solid-demo-image-chat"
        targetRef={() => imgRef}
      />
    </>
  );
}`;

export default function ImageChat() {
  let contentRef: HTMLImageElement | undefined;
  const { isDark } = useTheme();
  let handle: FastCommentsImageChatWidgetHandle | undefined;
  createEffect(() => handle?.update({ hasDarkBackground: isDark() }));

  return (
    <DemoChrome
      breadcrumb="Widgets / Image Chat"
      title="Image Chat"
      subtitle="Drag to select any region of the image. A threaded discussion gets pinned to that region. Ideal for design reviews, bug triage, and creative collaboration."
      tags={[{ label: 'Tenant · demo', brand: true }]}
      code={CODE}
      codeLabel="ImageChat.tsx"
    >
      <div class="fc-stage__panel fc-stage__panel--light">
        <img
          ref={contentRef}
          src="https://fastcomments.com/images/image-chat-demo-1.jpg"
          alt="Demo Image"
          style={{ 'max-width': '100%', 'border-radius': '12px', display: 'block', margin: '0 auto 20px' }}
        />
        <FastCommentsImageChatWidget
          apiRef={(h) => (handle = h)}
          tenantId="demo"
          urlId="solid-demo-image-chat"
          targetRef={() => contentRef}
          hasDarkBackground={isDark()}
        />
      </div>
    </DemoChrome>
  );
}
