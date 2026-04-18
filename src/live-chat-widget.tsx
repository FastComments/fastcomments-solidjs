import { type Component } from 'solid-js';
import type { FastCommentsLiveChatWidgetConfig } from 'fastcomments-typescript';
import { useFastCommentsWidget, type WidgetHandle } from './widget-lifecycle';
import { WidgetHost } from './widget-host';

export type FastCommentsLiveChatWidgetHandle = WidgetHandle<FastCommentsLiveChatWidgetConfig>;

export type FastCommentsLiveChatWidgetProps = FastCommentsLiveChatWidgetConfig & {
  apiRef?: (handle: FastCommentsLiveChatWidgetHandle) => void;
};

export const FastCommentsLiveChatWidget: Component<FastCommentsLiveChatWidgetProps> = (props) => {
  const ctl = useFastCommentsWidget(
    {
      scriptId: 'fastcomments-live-chat-script',
      scriptFile: 'embed-live-chat.min.js',
      globalName: 'FastCommentsLiveChat',
      errorMessage: 'Oh no! The comments section could not be loaded.',
    },
    props,
    { omitKeys: ['apiRef'] },
  );
  props.apiRef?.(ctl.handle);
  return <WidgetHost hostRef={ctl.hostRef} error={ctl.error} errorMessage={ctl.errorMessage} />;
};
