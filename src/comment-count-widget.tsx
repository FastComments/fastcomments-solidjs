import { type Component } from 'solid-js';
import type { FastCommentsCommentCountConfig } from 'fastcomments-typescript';
import { useFastCommentsWidget, type WidgetHandle } from './widget-lifecycle';
import { WidgetHost } from './widget-host';

export type FastCommentsCommentCountWidgetHandle = WidgetHandle<FastCommentsCommentCountConfig>;

export type FastCommentsCommentCountWidgetProps = FastCommentsCommentCountConfig & {
  apiRef?: (handle: FastCommentsCommentCountWidgetHandle) => void;
};

export const FastCommentsCommentCountWidget: Component<FastCommentsCommentCountWidgetProps> = (props) => {
  const ctl = useFastCommentsWidget(
    {
      scriptId: 'fastcomments-count-widget-script',
      scriptFile: 'widget-comment-count.min.js',
      globalName: 'FastCommentsCommentCount',
      errorMessage: 'Oh no! The comment count could not be loaded.',
    },
    props,
    { omitKeys: ['apiRef'] },
  );
  props.apiRef?.(ctl.handle);
  return <WidgetHost hostRef={ctl.hostRef} error={ctl.error} errorMessage={ctl.errorMessage} />;
};
