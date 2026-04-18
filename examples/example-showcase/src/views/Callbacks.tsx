import { createEffect, createSignal, For, Show } from 'solid-js';
import { FastCommentsCommentWidget, type FastCommentsCommentWidgetHandle } from 'fastcomments-solidjs';
import { useTheme } from '../theme';
import DemoChrome from './_DemoChrome';

const CODE = `import { FastCommentsCommentWidget } from 'fastcomments-solidjs';

export default function Callbacks() {
  return (
    <FastCommentsCommentWidget
      tenantId="demo"
      urlId="solid-demo-callbacks"
      onInit={() => console.log('onInit')}
      onRender={() => console.log('onRender')}
      onCommentsRendered={(comments) => console.log('rendered', comments.length)}
      commentCountUpdated={(count) => console.log('count', count)}
      onAuthenticationChange={(event, data) => console.log(event, data)}
      onReplySuccess={(comment) => console.log('reply', comment)}
      onVoteSuccess={(c, voteId, direction) => console.log('vote', direction)}
      onCommentSubmitStart={(comment, continueFn) => continueFn()}
    />
  );
}`;

type Event = { id: number; name: string; payload: string; at: string };

export default function Callbacks() {
  const [events, setEvents] = createSignal<Event[]>([]);
  const { isDark } = useTheme();
  let handle: FastCommentsCommentWidgetHandle | undefined;
  createEffect(() => handle?.update({ hasDarkBackground: isDark() }));

  let seq = 0;
  const track = (name: string, payload: unknown) => {
    const pretty = typeof payload === 'string' ? payload : JSON.stringify(payload).slice(0, 220);
    setEvents((prev) => [{ id: ++seq, name, payload: pretty, at: new Date().toLocaleTimeString() }, ...prev].slice(0, 40));
    console.log(`Callback: ${name}`, payload);
  };

  const handlers = {
    onInit: () => track('onInit', ''),
    onRender: () => track('onRender', ''),
    onCommentsRendered: (comments: unknown[]) => track('onCommentsRendered', `${comments.length} comments`),
    commentCountUpdated: (count: number) => track('commentCountUpdated', `count=${count}`),
    onAuthenticationChange: (event: string, data: unknown) => track('onAuthenticationChange', { event, data }),
    onReplySuccess: (comment: unknown) => track('onReplySuccess', comment),
    onVoteSuccess: (_comment: unknown, voteId: string, direction: string, status: string) =>
      track('onVoteSuccess', { voteId, direction, status }),
    onImageClicked: (src: string) => track('onImageClicked', src),
    onOpenProfile: (context: unknown) => {
      track('onOpenProfile', context);
      return false;
    },
    onUserBlocked: (userId: string, _c: unknown, isBlocked: boolean) => track('onUserBlocked', { userId, isBlocked }),
    onCommentFlagged: (userId: string, _c: unknown, isFlagged: boolean) => track('onCommentFlagged', { userId, isFlagged }),
    onCommentEdited: (userId: string, comment: unknown) =>
      track('onCommentEdited', { userId, id: (comment as { _id?: string })._id }),
    onCommentDeleted: (userId: string, comment: unknown) =>
      track('onCommentDeleted', { userId, id: (comment as { _id?: string })._id }),
    onCommentSubmitStart: (_comment: unknown, continueSubmitFn: () => void) => {
      track('onCommentSubmitStart', _comment);
      continueSubmitFn();
    },
  };

  return (
    <DemoChrome
      breadcrumb="Flows / Event Callbacks"
      title="Event Callbacks"
      subtitle="Every lifecycle and user-action hook the widget fires, mirrored live in an event log. Handy for wiring analytics, audit trails, or custom submission gates."
      tags={[{ label: 'Tenant · demo', brand: true }, { label: `Events · ${events().length}` }]}
      code={CODE}
      codeLabel="Callbacks.tsx"
    >
      <div style={{ display: 'grid', 'grid-template-columns': 'minmax(0, 1.3fr) minmax(280px, 0.9fr)', gap: '18px' }}>
        <div class="fc-stage__panel fc-stage__panel--light" style={{ 'min-width': 0 }}>
          <FastCommentsCommentWidget
            apiRef={(h) => (handle = h)}
            tenantId="demo"
            urlId="solid-demo-callbacks"
            hasDarkBackground={isDark()}
            {...handlers}
          />
        </div>
        <div class="fc-stage__panel" style={{ display: 'flex', 'flex-direction': 'column', gap: '14px' }}>
          <div style={{ display: 'flex', 'align-items': 'center', 'justify-content': 'space-between' }}>
            <span style={{ 'font-family': 'var(--fc-mono)', 'font-size': '10.5px', 'letter-spacing': '0.22em', 'text-transform': 'uppercase', color: 'var(--fc-ink-mute)' }}>
              <span style={{ display: 'inline-block', width: '7px', height: '7px', 'border-radius': '50%', background: '#27be69', 'margin-right': '8px' }} />
              Event log
            </span>
            <button class="fc-btn" style={{ padding: '6px 12px', 'font-size': '11px' }} onClick={() => setEvents([])}>clear</button>
          </div>
          <div class="fc-log">
            <Show when={events().length === 0}>
              <span class="fc-log__line">&gt; waiting for events...</span>
            </Show>
            <For each={events()}>
              {(e) => (
                <span class="fc-log__line fc-log__line--in">
                  [{e.at}] {e.name} <span style={{ color: 'var(--fc-ink-mute)' }}>· {e.payload}</span>
                </span>
              )}
            </For>
          </div>
        </div>
      </div>
    </DemoChrome>
  );
}
