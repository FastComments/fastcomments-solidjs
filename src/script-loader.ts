type PromiseResolver = (value: void | PromiseLike<void>) => void;
type PromiseRejection = (reason?: unknown) => void;
type PromiseHandler = [PromiseResolver, PromiseRejection];

type LoaderState = 'idle' | 'loading' | 'loaded';

/**
 * Load a script exactly once per URL. After load, late callers resolve
 * immediately. After error, the loader resets to `idle` so the next caller
 * triggers a fresh attempt (transient network failures are recoverable).
 * Concurrent callers during `loading` share one <script> tag.
 */
export class ScriptLoader {
  state: LoaderState = 'idle';
  private handlers: PromiseHandler[] = [];

  async insertScript(src: string, id: string, parentElement: Element): Promise<void> {
    if (this.state === 'loaded') return;
    if (this.state === 'loading') {
      return new Promise<void>((resolve, reject) => {
        this.handlers.push([resolve, reject]);
      });
    }
    // state === 'idle'
    this.state = 'loading';
    this.handlers = [];
    return new Promise<void>((resolve, reject) => {
      const script = window.document.createElement('script');
      script.async = true;
      script.src = src;
      script.id = id;
      parentElement.appendChild(script);

      this.handlers.push([resolve, reject]);
      script.addEventListener('load', () => {
        this.state = 'loaded';
        const pending = this.handlers;
        this.handlers = [];
        pending.forEach((h) => h[0]());
      });
      script.addEventListener('error', (event) => {
        this.state = 'idle';
        const pending = this.handlers;
        this.handlers = [];
        script.remove();
        pending.forEach((h) => h[1](event));
      });
    });
  }
}

const loaders = new Map<string, ScriptLoader>();

/**
 * Get the shared loader for a given script URL. Two widgets loading the same
 * CDN script share one <script> tag; distinct URLs each get their own loader.
 * (Keyed by URL rather than DOM id because multiple widgets can legitimately
 * share a DOM id string while loading entirely different scripts.)
 */
export function getSharedLoader(scriptUrl: string): ScriptLoader {
  let loader = loaders.get(scriptUrl);
  if (!loader) {
    loader = new ScriptLoader();
    loaders.set(scriptUrl, loader);
  }
  return loader;
}
