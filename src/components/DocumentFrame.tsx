'use client';

import { useEffect, useState } from 'react';
import { site } from '@/lib/content';

/**
 * The drawing-sheet margin: a hairline inset over the viewport with corner
 * ticks, the doc stamps, and the scroll-progress line riding its top edge.
 * Purely decorative, never interactive.
 */
export function DocumentFrame() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;

    const measure = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, doc.scrollTop / max)) : 0);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="no-print pointer-events-none fixed z-40 inset-[var(--frame-inset)]"
    >
      <div className="absolute inset-0 border border-hairline" />

      {/* Corner ticks */}
      <span className="absolute -top-px -left-px h-3 w-3 border-t-2 border-l-2 border-ink" />
      <span className="absolute -top-px -right-px h-3 w-3 border-t-2 border-r-2 border-ink" />
      <span className="absolute -bottom-px -left-px h-3 w-3 border-b-2 border-l-2 border-ink" />
      <span className="absolute -bottom-px -right-px h-3 w-3 border-b-2 border-r-2 border-ink" />

      {/* Scroll progress, styled as a telemetry trace on the top rule */}
      <span
        className="absolute -top-px left-0 h-0.5 bg-accent"
        style={{ width: `${progress * 100}%` }}
      />

      <span className="t-stamp absolute -bottom-[0.45rem] left-4 hidden bg-paper px-2 text-muted lg:block">
        DOC NO. {site.docNumber}
      </span>
      <span className="t-stamp absolute -bottom-[0.45rem] right-4 hidden bg-paper px-2 text-muted lg:block">
        {site.revision} / STATUS: {site.status}
      </span>
    </div>
  );
}
