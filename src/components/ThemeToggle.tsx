'use client';

import { useCallback, useSyncExternalStore } from 'react';

const KEY = 'yp-theme';

/** The theme lives on <html data-theme>, set pre-paint by the boot script. */
function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => mo.disconnect();
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(
    subscribe,
    () => document.documentElement.getAttribute('data-theme') === 'dark',
    () => false,
  );

  const toggle = useCallback(() => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* private mode: the choice just does not persist */
    }
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      className="t-stamp inline-flex items-center gap-2 border border-hairline px-2.5 py-1.5 text-muted transition-colors hover:border-accent hover:text-ink"
    >
      <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
        <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M6 1a5 5 0 0 0 0 10Z" fill="currentColor" />
      </svg>
      <span aria-hidden="true" className="hidden sm:inline">
        Night ops
      </span>
      <span className="sr-only">Night ops theme</span>
    </button>
  );
}
