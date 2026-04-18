import { FastCommentsCommentCountWidget } from 'fastcomments-solidjs';
import DemoChrome from './_DemoChrome';

const CODE = `import { FastCommentsCommentCountWidget } from 'fastcomments-solidjs';

export default function CommentCount() {
  return <FastCommentsCommentCountWidget tenantId="demo" urlId="solid-demo" />;
}`;

export default function CommentCount() {
  return (
    <DemoChrome
      breadcrumb="Widgets / Comment Count"
      title="Comment Count"
      subtitle="A low-weight count badge for article listings, cards, and feeds. The number stays live as new comments come in."
      tags={[{ label: 'Tenant · demo', brand: true }]}
      code={CODE}
      codeLabel="CommentCount.tsx"
    >
      <div class="fc-stage__panel" style={{ display: 'flex', 'align-items': 'center', gap: '14px' }}>
        <span style={{ 'font-family': 'var(--fc-mono)', 'font-size': '12px', color: 'var(--fc-ink-mute)', 'letter-spacing': '0.2em', 'text-transform': 'uppercase' }}>
          Count rendered →
        </span>
        <div style={{ 'font-family': 'var(--fc-body)', 'font-size': '14px', color: 'var(--fc-ink)' }}>
          <FastCommentsCommentCountWidget tenantId="demo" urlId="solid-demo" />
        </div>
      </div>
    </DemoChrome>
  );
}
