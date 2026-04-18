import { type Component } from 'solid-js';
import { useFastCommentsWidget, type WidgetHandle } from './widget-lifecycle';
import { WidgetHost } from './widget-host';

// fastcomments-typescript does not yet export a config type for this widget;
// mirrors the hand-rolled interface in fastcomments-react.
export interface FastCommentsRecentCommentsWidgetConfig {
  tenantId: string;
  urlId?: string;
  count?: number;
  hasDarkBackground?: boolean;
  translations?: Record<string, string>;
  region?: 'eu' | string;
  apiHost?: string;
}

export type FastCommentsRecentCommentsWidgetHandle = WidgetHandle<FastCommentsRecentCommentsWidgetConfig>;

export type FastCommentsRecentCommentsWidgetProps = FastCommentsRecentCommentsWidgetConfig & {
  apiRef?: (handle: FastCommentsRecentCommentsWidgetHandle) => void;
};

export const FastCommentsRecentCommentsWidget: Component<FastCommentsRecentCommentsWidgetProps> = (props) => {
  const ctl = useFastCommentsWidget(
    {
      scriptId: 'fastcomments-recent-comments-v2-script',
      scriptFile: 'widget-recent-comments-v2.min.js',
      globalName: 'FastCommentsRecentCommentsV2',
      errorMessage: 'Oh no! The recent comments could not be loaded.',
    },
    props,
    { omitKeys: ['apiRef'] },
  );
  props.apiRef?.(ctl.handle);
  return <WidgetHost hostRef={ctl.hostRef} error={ctl.error} errorMessage={ctl.errorMessage} />;
};
