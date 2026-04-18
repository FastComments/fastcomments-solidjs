import { type Component } from 'solid-js';
import type { FastCommentsCollabChatWidgetConfig } from 'fastcomments-typescript';
import { useFastCommentsWidget, type WidgetHandle } from './widget-lifecycle';
import { WidgetHost } from './widget-host';

export type FastCommentsCollabChatWidgetHandle = WidgetHandle<FastCommentsCollabChatWidgetConfig>;

export type FastCommentsCollabChatWidgetProps = FastCommentsCollabChatWidgetConfig & {
  /** Returns the element the collab-chat widget should attach to. */
  targetRef: () => HTMLElement | undefined;
  apiRef?: (handle: FastCommentsCollabChatWidgetHandle) => void;
};

export const FastCommentsCollabChatWidget: Component<FastCommentsCollabChatWidgetProps> = (props) => {
  const ctl = useFastCommentsWidget(
    {
      scriptId: 'fastcomments-collab-chat-script',
      scriptFile: 'embed-collab-chat.min.js',
      globalName: 'FastCommentsCollabChat',
      errorMessage: 'Oh no! The comments section could not be loaded.',
    },
    props,
    {
      targetRef: () => props.targetRef(),
      omitKeys: ['targetRef', 'apiRef'],
    },
  );
  props.apiRef?.(ctl.handle);
  return <WidgetHost hostRef={ctl.hostRef} error={ctl.error} errorMessage={ctl.errorMessage} />;
};
