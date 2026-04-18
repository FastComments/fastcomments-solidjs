import { type Component } from 'solid-js';
import type { FastCommentsImageChatWidgetConfig } from 'fastcomments-typescript';
import { useFastCommentsWidget, type WidgetHandle } from './widget-lifecycle';
import { WidgetHost } from './widget-host';

export type FastCommentsImageChatWidgetHandle = WidgetHandle<FastCommentsImageChatWidgetConfig>;

export type FastCommentsImageChatWidgetProps = FastCommentsImageChatWidgetConfig & {
  /** Returns the element (typically an <img>) the image-chat widget should attach to. */
  targetRef: () => HTMLElement | undefined;
  apiRef?: (handle: FastCommentsImageChatWidgetHandle) => void;
};

export const FastCommentsImageChatWidget: Component<FastCommentsImageChatWidgetProps> = (props) => {
  const ctl = useFastCommentsWidget(
    {
      scriptId: 'fastcomments-image-chat-script',
      scriptFile: 'embed-image-chat.min.js',
      globalName: 'FastCommentsImageChat',
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
