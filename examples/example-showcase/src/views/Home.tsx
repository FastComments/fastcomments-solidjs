import { For } from 'solid-js';
import type { Entry, ViewKey } from '../App';

type HomeProps = {
  entries: Entry[];
  widgets: Entry[];
  flows: Entry[];
  onSelect: (key: ViewKey) => void;
};

export default function Home(props: HomeProps) {
  return (
    <>
      <div class="fc-hero">
        <div>
          <div class="fc-hero__label">fastcomments / solid · showcase</div>
          <h1 class="fc-hero__title">
            Comment<br />infrastructure<br /><em>for Solid.</em>
          </h1>
          <p class="fc-hero__body">
            Every widget and integration flow the Solid library ships with. Running live against the public demo
            tenant. Use the rail to jump between examples; each view is a pristine implementation you can lift
            directly into production.
          </p>
        </div>

        <div class="fc-hero__meta">
          <div class="fc-meta-card">
            <div class="fc-meta-card__key">Widgets</div>
            <div class="fc-meta-card__value fc-meta-card__value--gradient">{props.widgets.length}</div>
          </div>
          <div class="fc-meta-card">
            <div class="fc-meta-card__key">Flows</div>
            <div class="fc-meta-card__value">{props.flows.length}</div>
          </div>
          <div class="fc-meta-card">
            <div class="fc-meta-card__key">Package</div>
            <div class="fc-meta-card__value" style={{ 'font-family': 'var(--fc-mono)', 'font-size': '14px', 'margin-top': '10px' }}>fastcomments-solidjs</div>
          </div>
          <div class="fc-meta-card">
            <div class="fc-meta-card__key">Runtime</div>
            <div class="fc-meta-card__value" style={{ 'font-family': 'var(--fc-mono)', 'font-size': '14px', 'margin-top': '10px' }}>Vite · Solid 1.8</div>
          </div>
        </div>
      </div>

      <div class="fc-section-title">
        <span>01</span>
        <h2>Widgets</h2>
        <div class="fc-rule" />
        <span>{props.widgets.length} components</span>
      </div>
      <div class="fc-grid">
        <For each={props.widgets}>
          {(item, i) => (
            <button
              class="fc-card"
              onClick={() => props.onSelect(item.key)}
              style={{ animation: 'fc-rise 480ms ease both', 'animation-delay': `${i() * 40}ms` }}
            >
              <span class="fc-card__kind">{item.kind}</span>
              <span class="fc-card__title">{item.label}</span>
              <span class="fc-card__hint">{item.hint}</span>
              <span class="fc-card__cta">Open example</span>
            </button>
          )}
        </For>
      </div>

      <div class="fc-section-title">
        <span>02</span>
        <h2>Flows &amp; configuration</h2>
        <div class="fc-rule" />
        <span>{props.flows.length} recipes</span>
      </div>
      <div class="fc-grid">
        <For each={props.flows}>
          {(item, i) => (
            <button
              class="fc-card"
              onClick={() => props.onSelect(item.key)}
              style={{ animation: 'fc-rise 480ms ease both', 'animation-delay': `${i() * 40}ms` }}
            >
              <span class="fc-card__kind">{item.kind}</span>
              <span class="fc-card__title">{item.label}</span>
              <span class="fc-card__hint">{item.hint}</span>
              <span class="fc-card__cta">Open example</span>
            </button>
          )}
        </For>
      </div>
    </>
  );
}
