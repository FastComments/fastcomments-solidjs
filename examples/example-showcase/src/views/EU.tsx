import { createEffect } from 'solid-js';
import { FastCommentsCommentWidget, type FastCommentsCommentWidgetHandle } from 'fastcomments-solidjs';
import { useTheme } from '../theme';
import DemoChrome from './_DemoChrome';

const CODE = `import { FastCommentsCommentWidget } from 'fastcomments-solidjs';

export default function EU() {
  return (
    <FastCommentsCommentWidget
      tenantId="demo"
      region="eu"
      urlId="solid-demo-eu"
    />
  );
}`;

export default function EU() {
  const { isDark } = useTheme();
  let handle: FastCommentsCommentWidgetHandle | undefined;
  createEffect(() => handle?.update({ hasDarkBackground: isDark() }));
  return (
    <DemoChrome
      breadcrumb="Flows / EU Region"
      title="EU Region"
      subtitle={<>Pin widget reads and writes to the EU datacenter to satisfy data-residency requirements. A single
        <code style={{ 'font-family': 'var(--fc-mono)', color: 'var(--fc-ink)', margin: '0 4px' }}>region="eu"</code>
        flag routes everything through the EU cluster.</>}
      tags={[{ label: 'Region · EU', brand: true }, { label: 'GDPR-friendly' }]}
      code={CODE}
      codeLabel="EU.tsx"
    >
      <div class="fc-stage__panel fc-stage__panel--light">
        <FastCommentsCommentWidget apiRef={(h) => (handle = h)} tenantId="demo" region="eu" urlId="solid-demo-eu" hasDarkBackground={isDark()} />
      </div>
    </DemoChrome>
  );
}
