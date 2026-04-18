import { type Component } from 'solid-js';
import { useFastCommentsWidget, type WidgetHandle } from './widget-lifecycle';
import { WidgetHost } from './widget-host';

// fastcomments-typescript does not yet export a config type for this widget;
// mirrors the hand-rolled interface in fastcomments-react.
export interface FastCommentsRecentDiscussionsWidgetConfig {
  tenantId: string;
  count?: number;
  hasDarkBackground?: boolean;
  translations?: Record<string, string>;
  region?: 'eu' | string;
  apiHost?: string;
}

export type FastCommentsRecentDiscussionsWidgetHandle = WidgetHandle<FastCommentsRecentDiscussionsWidgetConfig>;

export type FastCommentsRecentDiscussionsWidgetProps = FastCommentsRecentDiscussionsWidgetConfig & {
  apiRef?: (handle: FastCommentsRecentDiscussionsWidgetHandle) => void;
};

export const FastCommentsRecentDiscussionsWidget: Component<FastCommentsRecentDiscussionsWidgetProps> = (props) => {
  const ctl = useFastCommentsWidget(
    {
      scriptId: 'fastcomments-recent-discussions-v2-script',
      scriptFile: 'widget-recent-discussions-v2.min.js',
      globalName: 'FastCommentsRecentDiscussionsV2',
      errorMessage: 'Oh no! The recent discussions could not be loaded.',
    },
    props,
    { omitKeys: ['apiRef'] },
  );
  props.apiRef?.(ctl.handle);
  return <WidgetHost hostRef={ctl.hostRef} error={ctl.error} errorMessage={ctl.errorMessage} />;
};
