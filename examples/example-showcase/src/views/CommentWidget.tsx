import { createEffect } from 'solid-js';
import { FastCommentsCommentWidget, type FastCommentsCommentWidgetHandle } from 'fastcomments-solidjs';
import { useTheme } from '../theme';
import DemoChrome from './_DemoChrome';

const CODE = `import { FastCommentsCommentWidget } from 'fastcomments-solidjs';

export default function CommentsPage() {
  return <FastCommentsCommentWidget tenantId="demo" urlId="solid-demo" />;
}`;

export default function CommentWidget() {
  const { isDark } = useTheme();
  let handle: FastCommentsCommentWidgetHandle | undefined;
  createEffect(() => handle?.update({ hasDarkBackground: isDark() }));
  return (
    <DemoChrome
      breadcrumb="Widgets / Live Comment Widget"
      title="Live Comment Widget"
      subtitle="The flagship live commenting widget. Replies, voting, moderation, media attachments, and realtime sync come bundled in the default configuration."
      tags={[{ label: 'Tenant · demo', brand: true }, { label: 'urlId · solid-demo' }]}
      code={CODE}
      codeLabel="CommentWidget.tsx"
    >
      <div class="fc-stage__panel fc-stage__panel--light">
        <FastCommentsCommentWidget apiRef={(h) => (handle = h)} tenantId="demo" urlId="solid-demo" hasDarkBackground={isDark()} />
      </div>
    </DemoChrome>
  );
}
