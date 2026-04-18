import { type Component } from 'solid-js';
import { useFastCommentsWidget, type WidgetHandle } from './widget-lifecycle';
import { WidgetHost } from './widget-host';

// fastcomments-typescript does not yet export a config type for this widget;
// mirrors the hand-rolled interface in fastcomments-react.
export interface FastCommentsReviewsSummaryWidgetConfig {
  /** Id that represents you as a customer. */
  tenantId: string;
  /** Id that represents the page, if you don't want to tie comments to the page url. Could be a URL or an ID (like an article id). */
  urlId?: string;
  /** The region your account is in. If your account was created via fastcomments.com, you can leave this undefined. EU customers will want to set it to 'eu'. Does not apply to VanillaJS widget. */
  region?: 'eu';
}

export type FastCommentsReviewsSummaryWidgetHandle = WidgetHandle<FastCommentsReviewsSummaryWidgetConfig>;

export type FastCommentsReviewsSummaryWidgetProps = FastCommentsReviewsSummaryWidgetConfig & {
  apiRef?: (handle: FastCommentsReviewsSummaryWidgetHandle) => void;
};

export const FastCommentsReviewsSummaryWidget: Component<FastCommentsReviewsSummaryWidgetProps> = (props) => {
  const ctl = useFastCommentsWidget(
    {
      scriptId: 'fastcomments-rs-widget-script',
      scriptFile: 'embed-reviews-summary.min.js',
      globalName: 'FastCommentsReviewsSummaryWidget',
      errorMessage: 'Oh no! The reviews summary could not be loaded.',
      useCallbackInit: true,
    },
    props,
    { omitKeys: ['apiRef'] },
  );
  props.apiRef?.(ctl.handle);
  return <WidgetHost hostRef={ctl.hostRef} error={ctl.error} errorMessage={ctl.errorMessage} />;
};
