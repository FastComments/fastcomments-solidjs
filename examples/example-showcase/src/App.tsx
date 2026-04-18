import { createSignal, For, type Component } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useTheme } from './theme';
import Home from './views/Home';
import CommentWidget from './views/CommentWidget';
import CommentCount from './views/CommentCount';
import ReviewsSummary from './views/ReviewsSummary';
import LiveChat from './views/LiveChat';
import CollabChat from './views/CollabChat';
import ImageChat from './views/ImageChat';
import UserActivityFeed from './views/UserActivityFeed';
import DarkMode from './views/DarkMode';
import EU from './views/EU';
import Paginated from './views/Paginated';
import OpenProfile from './views/OpenProfile';
import Callbacks from './views/Callbacks';
import SimpleSSO from './views/SimpleSSO';
import SecureSSO from './views/SecureSSO';

export type ViewKey =
  | 'home'
  | 'comments'
  | 'comment-count'
  | 'reviews-summary'
  | 'live-chat'
  | 'collab-chat'
  | 'image-chat'
  | 'activity-feed'
  | 'dark-mode'
  | 'eu'
  | 'paginated'
  | 'open-profile'
  | 'callbacks'
  | 'simple-sso'
  | 'secure-sso';

export type Entry = {
  key: ViewKey;
  label: string;
  hint: string;
  kind: 'widget' | 'flow';
};

const WIDGETS: Entry[] = [
  { key: 'comments',         label: 'Live Comment Widget', kind: 'widget', hint: 'Full live commenting widget' },
  { key: 'comment-count',    label: 'Comment Count',      kind: 'widget', hint: 'Inline count badge' },
  { key: 'live-chat',        label: 'Live Chat',          kind: 'widget', hint: 'Realtime streaming widget' },
  { key: 'collab-chat',      label: 'Collab Chat',        kind: 'widget', hint: 'Text-anchored threads' },
  { key: 'image-chat',       label: 'Image Chat',         kind: 'widget', hint: 'Region comments on images' },
  { key: 'reviews-summary',  label: 'Reviews Summary',    kind: 'widget', hint: 'Star ratings overview' },
  { key: 'activity-feed',    label: 'Activity Feed',      kind: 'widget', hint: 'Per-user timeline' },
];

const FLOWS: Entry[] = [
  { key: 'callbacks',        label: 'Event Callbacks',    kind: 'flow',   hint: 'Every lifecycle event mirrored live' },
  { key: 'dark-mode',        label: 'Dark Mode',          kind: 'flow',   hint: 'Runtime theme switching' },
  { key: 'eu',               label: 'EU Region',          kind: 'flow',   hint: 'Data residency via region flag' },
  { key: 'paginated',        label: 'Thread Pagination',  kind: 'flow',   hint: 'Swap urlId / product live' },
  { key: 'open-profile',     label: 'Open Profile',       kind: 'flow',   hint: 'Imperatively open a user profile' },
  { key: 'simple-sso',       label: 'Simple SSO',         kind: 'flow',   hint: 'Unsigned identity' },
  { key: 'secure-sso',       label: 'Secure SSO',         kind: 'flow',   hint: 'HMAC-signed identity' },
];

const ALL_ENTRIES: Entry[] = [...WIDGETS, ...FLOWS];

const VIEWS: Record<ViewKey, Component | null> = {
  'home': null,
  'comments': CommentWidget,
  'comment-count': CommentCount,
  'reviews-summary': ReviewsSummary,
  'live-chat': LiveChat,
  'collab-chat': CollabChat,
  'image-chat': ImageChat,
  'activity-feed': UserActivityFeed,
  'dark-mode': DarkMode,
  'eu': EU,
  'paginated': Paginated,
  'open-profile': OpenProfile,
  'callbacks': Callbacks,
  'simple-sso': SimpleSSO,
  'secure-sso': SecureSSO,
};

const App: Component = () => {
  const [selected, setSelected] = createSignal<ViewKey>('home');
  const { theme, setTheme } = useTheme();

  const go = (key: ViewKey) => {
    setSelected(key);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div class="fc-shell">
      <aside class="fc-rail">
        <button class="fc-brand" onClick={() => go('home')}>
          <img class="fc-brand__logo fc-brand__logo--light" src="https://fastcomments.com/images/svg/v2/logo.svg" alt="FastComments" />
          <img class="fc-brand__logo fc-brand__logo--dark" src="https://fastcomments.com/images/svg/v2/logo_white.svg" alt="" aria-hidden="true" />
          <span class="fc-brand__wordmark">
            <span class="fc-brand__name">FastComments</span>
            <span class="fc-brand__slug">solid · showcase</span>
          </span>
        </button>

        <nav class="fc-nav" aria-label="Examples">
          <div class="fc-nav__group">
            <div class="fc-nav__heading"><span>01</span><em>Widgets</em></div>
            <For each={WIDGETS}>
              {(item) => (
                <button
                  type="button"
                  class={`fc-nav__item${selected() === item.key ? ' is-active' : ''}`}
                  onClick={() => go(item.key)}
                >
                  <span class="fc-nav__item-label">{item.label}</span>
                  <span class="fc-nav__item-hint">{item.hint}</span>
                </button>
              )}
            </For>
          </div>

          <div class="fc-nav__group">
            <div class="fc-nav__heading"><span>02</span><em>Flows &amp; configuration</em></div>
            <For each={FLOWS}>
              {(item) => (
                <button
                  type="button"
                  class={`fc-nav__item${selected() === item.key ? ' is-active' : ''}`}
                  onClick={() => go(item.key)}
                >
                  <span class="fc-nav__item-label">{item.label}</span>
                  <span class="fc-nav__item-hint">{item.hint}</span>
                </button>
              )}
            </For>
          </div>
        </nav>

        <footer class="fc-rail__foot">
          <div class="fc-theme-toggle" role="group" aria-label="Theme">
            <button type="button" class={`fc-theme-toggle__btn${theme() === 'light' ? ' is-active' : ''}`} onClick={() => setTheme('light')}>Light</button>
            <button type="button" class={`fc-theme-toggle__btn${theme() === 'dark' ? ' is-active' : ''}`} onClick={() => setTheme('dark')}>Dark</button>
          </div>
          <div><code>npm i fastcomments-solidjs</code></div>
          <a href="https://fastcomments.com" rel="noopener">fastcomments.com &nearr;</a>
        </footer>
      </aside>

      <main class="fc-stage">
        {(() => {
          const key = selected();
          const View = VIEWS[key];
          if (key === 'home' || !View) {
            return <Home entries={ALL_ENTRIES} onSelect={go} widgets={WIDGETS} flows={FLOWS} />;
          }
          return <Dynamic component={View} />;
        })()}
      </main>
    </div>
  );
};

export { ALL_ENTRIES };
export default App;
