import { createEffect } from 'solid-js';
import {
  FastCommentsUserActivityFeedWidget,
  type FastCommentsUserActivityFeedWidgetHandle,
} from 'fastcomments-solidjs';
import { useTheme } from '../theme';
import DemoChrome from './_DemoChrome';

const CODE = `import { FastCommentsUserActivityFeedWidget } from 'fastcomments-solidjs';

export default function ActivityFeed() {
  // SSO userId format: \`\${tenantId}:\${appUserId}\`
  return (
    <FastCommentsUserActivityFeedWidget
      tenantId="demo"
      userId="demo:someone@somewhere.com"
      readonly
    />
  );
}`;

export default function UserActivityFeed() {
  const { isDark } = useTheme();
  const tenantId = 'demo';
  const appUserId = 'someone@somewhere.com';
  const fastCommentsUserId = `${tenantId}:${appUserId}`;
  let handle: FastCommentsUserActivityFeedWidgetHandle | undefined;
  createEffect(() => handle?.update({ hasDarkBackground: isDark() }));

  return (
    <DemoChrome
      breadcrumb="Widgets / Activity Feed"
      title="User Activity Feed"
      subtitle="A chronological stream of a single user’s comments and interactions. Perfect for profile pages, moderation views, and reputation dashboards."
      tags={[{ label: 'Tenant · demo', brand: true }, { label: `userId · ${fastCommentsUserId}` }]}
      code={CODE}
      codeLabel="UserActivityFeed.tsx"
    >
      <div class="fc-stage__panel fc-stage__panel--light">
        <FastCommentsUserActivityFeedWidget
          apiRef={(h) => (handle = h)}
          tenantId={tenantId}
          userId={fastCommentsUserId}
          readonly={true}
          hasDarkBackground={isDark()}
        />
      </div>
    </DemoChrome>
  );
}
