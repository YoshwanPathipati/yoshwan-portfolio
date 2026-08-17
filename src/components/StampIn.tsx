'use client';

import { useEffect, useState } from 'react';
import { stampIn } from '@/lib/content';

/**
 * The document stamps itself in, once per session, in well under a second.
 *
 * Whether it plays at all is decided by the inline script in the root layout
 * before first paint (it sets `data-stamped` on <html> for repeat visits and
 * for reduced motion, which CSS uses to skip the overlay entirely). This
 * component only owns the markup and its own removal.
 */
export function StampIn() {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setMounted(false), 900);
    return () => window.clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <div id="stamp-in" aria-hidden="true" className="no-print">
      <div className="border border-hairline px-6 py-5 sm:px-10 sm:py-7">
        <span className="stamp-rule" />
        {stampIn.lines.map((line, i) => (
          <p
            key={line}
            className="t-label stamp-line text-ink"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
