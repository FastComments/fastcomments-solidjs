import { type Component } from 'solid-js';
import type { FastCommentsCommentWidgetConfig } from 'fastcomments-typescript';
import { useFastCommentsWidget, type WidgetHandle } from './widget-lifecycle';
import { WidgetHost } from './widget-host';

export interface FastCommentsUserActivityFeedWidgetConfig extends FastCommentsCommentWidgetConfig {
  /** With SSO, this will be tenantId + ':' + userId. With Simple SSO this will be tenantId + ':' + userEmail. */
  userId: string;
}

export type FastCommentsUserActivityFeedWidgetHandle = WidgetHandle<FastCommentsUserActivityFeedWidgetConfig>;

export type FastCommentsUserActivityFeedWidgetProps = FastCommentsUserActivityFeedWidgetConfig & {
  apiRef?: (handle: FastCommentsUserActivityFeedWidgetHandle) => void;
};

export const FastCommentsUserActivityFeedWidget: Component<FastCommentsUserActivityFeedWidgetProps> = (props) => {
  const ctl = useFastCommentsWidget(
    {
      scriptId: 'fastcomments-user-activity-script',
      scriptFile: 'embed-user-activity.min.js',
      globalName: 'FastCommentsUserActivity',
      errorMessage: 'Oh no! The comments section could not be loaded.',
      useCallbackInit: true,
    },
    props,
    { omitKeys: ['apiRef'] },
  );
  props.apiRef?.(ctl.handle);
  return <WidgetHost hostRef={ctl.hostRef} error={ctl.error} errorMessage={ctl.errorMessage} />;
};
