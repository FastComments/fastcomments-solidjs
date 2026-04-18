import { createSignal, For, Show, type JSX } from 'solid-js';

type Tag = { label: string; brand?: boolean };

export default function DemoChrome(props: {
  breadcrumb: string;
  title: string;
  subtitle: JSX.Element;
  tags?: Tag[];
  children: JSX.Element;
  code?: string;
  codeLabel?: string;
}) {
  const [copied, setCopied] = createSignal(false);

  async function copy() {
    if (!props.code) return;
    try {
      await navigator.clipboard.writeText(props.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignored */
    }
  }

  const head = () => props.breadcrumb.split('/')[0].trim();
  const tail = () => props.breadcrumb.split('/')[1]?.trim() ?? props.title;

  return (
    <div class="fc-demo">
      <header class="fc-demo__head">
        <div>
          <div class="fc-demo__breadcrumb">
            {head()} <em>/ {tail()}</em>
          </div>
          <h1 class="fc-demo__title">{props.title}</h1>
          <p class="fc-demo__subtitle">{props.subtitle}</p>
        </div>
        <Show when={props.tags && props.tags.length > 0}>
          <div class="fc-demo__actions">
            <For each={props.tags}>
              {(t) => <span class={`fc-tag${t.brand ? ' fc-tag--brand' : ''}`}>{t.label}</span>}
            </For>
          </div>
        </Show>
      </header>
      {props.children}
      <Show when={props.code}>
        <div class="fc-code-panel">
          <div class="fc-code-panel__head">
            <span class="fc-code-panel__head-label">{props.codeLabel ?? 'App.tsx'}</span>
            <button type="button" class="fc-code-panel__copy" onClick={copy}>
              {copied() ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre class="fc-code-panel__body">{props.code}</pre>
        </div>
      </Show>
    </div>
  );
}
