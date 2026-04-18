import { Show, type Accessor, type Component } from 'solid-js';

export const WidgetHost: Component<{
  hostRef: (el: HTMLDivElement) => void;
  error: Accessor<boolean>;
  errorMessage: string;
}> = (props) => {
  return (
    <div ref={props.hostRef}>
      <Show when={props.error()}>{props.errorMessage}</Show>
    </div>
  );
};
