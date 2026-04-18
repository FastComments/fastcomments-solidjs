import { type Component } from 'solid-js';
import type { FastCommentsCommentWidgetConfig } from 'fastcomments-typescript';
import { useFastCommentsWidget, type WidgetHandle } from './widget-lifecycle';
import { WidgetHost } from './widget-host';

export type FastCommentsCommentWidgetHandle = WidgetHandle<FastCommentsCommentWidgetConfig>;

export type FastCommentsCommentWidgetProps = FastCommentsCommentWidgetConfig & {
  /**
   * Receives an imperative handle synchronously during render. Use
   * `handle.update({ ... })` to push config changes to the live widget;
   * Solid does not auto-track deep changes to config objects, so this is
   * how you drive reactivity:
   *
   * ```tsx
   * let handle: FastCommentsCommentWidgetHandle | undefined;
   * createEffect(() => handle?.update({ hasDarkBackground: isDark() }));
   * <FastCommentsCommentWidget apiRef={(h) => (handle = h)} ... />
   * ```
   *
   * The handle is safe to call before the widget mounts: `update()` stashes
   * the partial and applies it at init, `getInstance()` returns null until
   * the script finishes loading, and `onInstance()` queues callbacks.
   */
  apiRef?: (handle: FastCommentsCommentWidgetHandle) => void;
};

export const FastCommentsCommentWidget: Component<FastCommentsCommentWidgetProps> = (props) => {
  const ctl = useFastCommentsWidget(
    {
      scriptId: 'fastcomments-widget-script',
      scriptFile: 'embed-v2.min.js',
      globalName: 'FastCommentsUI',
      errorMessage: 'Oh no! The comments section could not be loaded.',
    },
    props,
    { omitKeys: ['apiRef'] },
  );
  props.apiRef?.(ctl.handle);
  return <WidgetHost hostRef={ctl.hostRef} error={ctl.error} errorMessage={ctl.errorMessage} />;
};
