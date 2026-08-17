'use client';

import { useEffect, useState } from 'react';

/** True when the visitor has asked the OS to reduce motion. */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return reduced;
}

/** Fires once when the element first enters the viewport. */
export function useInViewOnce<T extends Element>(
  ref: React.RefObject<T | null>,
  amount = 0.2,
): boolean {
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: amount },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [ref, amount, seen]);

  return seen;
}
