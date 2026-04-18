import { createSignal, onCleanup, onMount, type Accessor } from 'solid-js';
import { isServer } from 'solid-js/web';
import { getSharedLoader } from './script-loader';

export interface WidgetInstance {
  destroy?: () => void;
  update?: (props: unknown) => void;
  [key: string]: unknown;
}

type WidgetFn = (element: HTMLElement, props: unknown) => WidgetInstance | void;
type WidgetFnWithCallback = (
  element: HTMLElement,
  props: unknown,
  cb: (err: unknown, instance: WidgetInstance) => void,
) => void;

export interface WidgetDefinition {
  /** DOM id used on the injected <script> tag. */
  scriptId: string;
  /** Path fragment after the CDN base (e.g. 'embed-v2.min.js'). */
  scriptFile: string;
  /** Name of the function the embed script attaches to window. */
  globalName: string;
  /** Shown inside the host element when the script fails to load. */
  errorMessage: string;
  /** When true, invoke `window[globalName](el, props, cb)` instead of `(el, props)`. */
  useCallbackInit?: boolean;
}

export interface UseFastCommentsWidgetOptions {
  /**
   * When provided, the widget mounts into this caller-supplied element
   * (collab-chat / image-chat use this). Otherwise a local host div is used.
   */
  targetRef?: Accessor<HTMLElement | undefined>;
  /** Keys to strip before passing props to the embed (e.g. 'targetRef'). */
  omitKeys?: string[];
}

/**
 * Imperative handle passed through `apiRef`. Solid does not track deep
 * mutations of config objects, so changes after first render must be
 * pushed explicitly via `update()`.
 */
export interface WidgetHandle<Config = Record<string, unknown>> {
  /** Most recent widget instance returned by the embed script, if any. */
  getInstance: () => WidgetInstance | null;
  /** Register a callback fired once the instance becomes available. */
  onInstance: (cb: (instance: WidgetInstance) => void) => void;
  /**
   * Merge a partial config into the live widget and call its `.update()`.
   * If invoked before the script has finished loading, the partial is
   * stashed and applied as soon as the instance initializes.
   */
  update: (partial: Partial<Config>) => void;
}

export interface WidgetController<Config = Record<string, unknown>> {
  /** ref callback for the internal host div. No-op when targetRef is supplied. */
  hostRef: (el: HTMLDivElement) => void;
  error: Accessor<boolean>;
  /** Message shown inside the host when loading fails. Mirrors `def.errorMessage`. */
  errorMessage: string;
  /** Imperative handle the widget file forwards through `apiRef`. */
  handle: WidgetHandle<Config>;
}

/** Strips infra-only props (apiRef/targetRef) so update() only accepts embed config keys. */
type StripInfra<T> = Omit<T, 'apiRef' | 'targetRef'>;

export function cdnBase(region?: string): string {
  return region === 'eu' ? 'https://cdn-eu.fastcomments.com/js/' : 'https://cdn.fastcomments.com/js/';
}

function cloneProps(
  props: Record<string, unknown>,
  omitKeys: string[] | undefined,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...props };
  if (omitKeys) {
    for (const key of omitKeys) delete out[key];
  }
  return out;
}

export function useFastCommentsWidget<Props extends { region?: string }>(
  def: WidgetDefinition,
  props: Props,
  opts: UseFastCommentsWidgetOptions = {},
): WidgetController<StripInfra<Props>> {
  type Config = StripInfra<Props>;
  const [error, setError] = createSignal(false);
  let localHost: HTMLDivElement | undefined;
  let lastInstance: WidgetInstance | null = null;
  let scriptLoaded = false;
  let initPending = false;
  let pendingUpdate = false;
  let disposed = false;
  let overlay: Record<string, unknown> = {};
  const instanceWaiters: Array<(instance: WidgetInstance) => void> = [];

  const hostRef = (el: HTMLDivElement) => {
    localHost = el;
  };

  const currentTarget = (): HTMLElement | undefined =>
    opts.targetRef ? opts.targetRef() : localHost;

  const buildPayload = (): Record<string, unknown> => {
    const base = cloneProps(props as unknown as Record<string, unknown>, opts.omitKeys);
    return { ...base, ...overlay };
  };

  const recordInstance = (instance: WidgetInstance) => {
    lastInstance = instance;
    const waiters = instanceWaiters.splice(0, instanceWaiters.length);
    for (const cb of waiters) cb(instance);
  };

  const instantiate = () => {
    const target = currentTarget();
    if (!target) return;
    const payload = buildPayload();
    const fn = (window as unknown as Record<string, unknown>)[def.globalName];
    if (typeof fn !== 'function') return;
    if (def.useCallbackInit) {
      initPending = true;
      (fn as WidgetFnWithCallback)(target, payload, (err, newInstance) => {
        initPending = false;
        if (disposed) return;
        if (err) {
          console.error('FastComments Widget Init Failure', err);
          return;
        }
        recordInstance(newInstance);
        if (pendingUpdate) {
          pendingUpdate = false;
          flushUpdate();
        }
      });
    } else {
      const instance = (fn as WidgetFn)(target, payload);
      if (instance) recordInstance(instance);
    }
  };

  const flushUpdate = () => {
    if (!lastInstance || typeof lastInstance.update !== 'function') {
      instantiate();
      return;
    }
    lastInstance.update(buildPayload());
  };

  const update = (partial: Partial<Config>) => {
    if (disposed) return;
    overlay = { ...overlay, ...(partial as Record<string, unknown>) };
    if (!scriptLoaded) return; // will be picked up at instantiate via buildPayload
    if (initPending) {
      pendingUpdate = true;
      return;
    }
    flushUpdate();
  };

  onMount(() => {
    if (isServer) return;
    void (async () => {
      try {
        const globalFn = (window as unknown as Record<string, unknown>)[def.globalName];
        if (!globalFn) {
          const url = cdnBase(props.region) + def.scriptFile;
          const loader = getSharedLoader(url);
          await loader.insertScript(url, def.scriptId, window.document.body);
        }
        if (disposed) return;
        scriptLoaded = true;
        instantiate();
      } catch (e) {
        if (disposed) return;
        console.error('FastComments Script Load Failure', e);
        setError(true);
      }
    })();
  });

  onCleanup(() => {
    disposed = true;
    if (lastInstance && typeof lastInstance.destroy === 'function') {
      try {
        lastInstance.destroy();
      } catch {
        // already torn down
      }
    }
    lastInstance = null;
    instanceWaiters.length = 0;
  });

  const handle: WidgetHandle<Config> = {
    getInstance: () => lastInstance,
    onInstance: (cb) => {
      if (disposed) return;
      if (lastInstance) cb(lastInstance);
      else instanceWaiters.push(cb);
    },
    update,
  };

  return {
    hostRef,
    error,
    errorMessage: def.errorMessage,
    handle,
  };
}
