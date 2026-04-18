import { type Component } from 'solid-js';
import { useFastCommentsWidget, type WidgetHandle } from './widget-lifecycle';
import { WidgetHost } from './widget-host';

// fastcomments-typescript does not yet export a config type for this widget;
// mirrors the hand-rolled interface in fastcomments-react.
export interface FastCommentsTopPagesWidgetConfig {
  tenantId: string;
  hasDarkBackground?: boolean;
  region?: 'eu' | string;
  apiHost?: string;
}

export type FastCommentsTopPagesWidgetHandle = WidgetHandle<FastCommentsTopPagesWidgetConfig>;

export type FastCommentsTopPagesWidgetProps = FastCommentsTopPagesWidgetConfig & {
  apiRef?: (handle: FastCommentsTopPagesWidgetHandle) => void;
};

export const FastCommentsTopPagesWidget: Component<FastCommentsTopPagesWidgetProps> = (props) => {
  const ctl = useFastCommentsWidget(
    {
      scriptId: 'fastcomments-top-pages-v2-script',
      scriptFile: 'widget-top-pages-v2.min.js',
      globalName: 'FastCommentsTopPagesV2',
      errorMessage: 'Oh no! The top pages could not be loaded.',
    },
    props,
    { omitKeys: ['apiRef'] },
  );
  props.apiRef?.(ctl.handle);
  return <WidgetHost hostRef={ctl.hostRef} error={ctl.error} errorMessage={ctl.errorMessage} />;
};
