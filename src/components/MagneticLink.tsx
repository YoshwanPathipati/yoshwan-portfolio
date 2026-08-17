'use client';

import { useRef } from 'react';
import { useReducedMotion } from '@/lib/hooks';
import { scrollToHash } from '@/lib/scroll';

const PULL = 6; // px, max displacement toward the pointer

/**
 * The primary CTA leans toward the cursor. Fine pointers only, and never when
 * motion is reduced.
 */
export function MagneticLink({
  href,
  children,
  className = '',
  download,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  download?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  const onPointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el || reduced || e.pointerType !== 'mouse') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    el.style.transform = `translate(${Math.max(-1, Math.min(1, dx)) * PULL}px, ${
      Math.max(-1, Math.min(1, dy)) * PULL
    }px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <a
      ref={ref}
      href={href}
      download={download}
      onClick={href.startsWith('#') ? (e) => scrollToHash(e, href) : undefined}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onBlur={reset}
      className={className}
    >
      {children}
    </a>
  );
}
