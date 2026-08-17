'use client';

import { useCallback, useEffect, useRef } from 'react';
import { asset } from '@/lib/asset';
import { easterEgg } from '@/lib/content';

/** Type "hire" anywhere and the document gets stamped. */
export function EasterEgg() {
  const ref = useRef<HTMLDialogElement>(null);

  const close = useCallback(() => ref.current?.close(), []);

  useEffect(() => {
    let buffer = '';

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        e.key.length !== 1 ||
        (target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable))
      ) {
        return;
      }

      buffer = (buffer + e.key.toLowerCase()).slice(-easterEgg.trigger.length);
      if (buffer === easterEgg.trigger && ref.current && !ref.current.open) {
        ref.current.showModal();
        buffer = '';
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <dialog
      ref={ref}
      id="interview-stamp"
      aria-labelledby="interview-stamp-title"
      className="no-print"
      onClick={(e) => {
        if (e.target === ref.current) close();
      }}
    >
      <div className="stamp-mark border-2 border-accent px-7 py-6 text-center sm:px-12 sm:py-9">
        <p id="interview-stamp-title" className="t-display-md text-accent-text uppercase">
          {easterEgg.stamp}
        </p>
        <p className="t-stamp mt-3 text-muted">{easterEgg.sub}</p>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <a href={asset(easterEgg.action.href)} download className="btn btn-primary">
          {easterEgg.action.label}
        </a>
        <button type="button" onClick={close} className="btn btn-ghost">
          {easterEgg.dismiss}
        </button>
      </div>
    </dialog>
  );
}
