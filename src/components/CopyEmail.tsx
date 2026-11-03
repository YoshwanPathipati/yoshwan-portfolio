'use client';

import { useEffect, useState } from 'react';

/**
 * A mailto link only helps visitors with a desktop mail client configured;
 * many recruiters work in webmail, so the address is one click from their
 * clipboard as well.
 */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      /* Clipboard blocked (insecure context or denied): the address is
         still on screen and in the mailto link. */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="t-label inline-flex items-center gap-2 border border-hairline px-3 py-2 text-muted transition-colors hover:border-accent hover:text-ink"
    >
      <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
        {copied ? (
          <path d="M2 6.5 5 9l5-6" fill="none" stroke="currentColor" strokeWidth="1.3" />
        ) : (
          <path d="M4 1.5h6.5V8M1.5 4h6v6.5h-6Z" fill="none" stroke="currentColor" strokeWidth="1.1" />
        )}
      </svg>
      <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
    </button>
  );
}
