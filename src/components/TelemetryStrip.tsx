'use client';

import { useEffect, useRef } from 'react';
import { telemetry } from '@/lib/content';
import { useInViewOnce, useReducedMotion } from '@/lib/hooks';

const DURATION = 1100;

/**
 * Renders the final value during prerender (so the numbers are correct with no
 * JavaScript at all) and only rewinds to the start once the bundle is running.
 * The strip is revealed by its parent, so the rewind is never visible.
 */
function Counter({ from, to, active }: { from: number; to: number; active: boolean }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduced) {
      el.textContent = String(to);
      return;
    }

    if (!active) {
      el.textContent = String(from);
      return;
    }

    // Written straight to the DOM: no re-render per frame.
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, from, to, reduced]);

  return <span ref={ref}>{to}</span>;
}

export function TelemetryStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const active = useInViewOnce(ref, 0.3);

  return (
    <aside aria-label="Selected metrics" className="border-y border-hairline bg-panel">
      <div className="shell">
        <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4">
          {telemetry.map((item) => (
            <div
              key={item.label}
              className="border-l border-t border-hairline px-4 py-6 sm:px-6 lg:border-t-0 lg:py-8 [&:nth-child(-n+2)]:border-t-0 [&:nth-child(2n+1)]:border-l-0 [&:nth-child(2n+1)]:pl-0 lg:[&:nth-child(2n+1)]:border-l lg:[&:nth-child(2n+1)]:pl-6 lg:first:border-l-0 lg:first:pl-0"
            >
              <p className="t-num text-[clamp(1.5rem,5.2vw,3.15rem)]">
                {item.kind === 'count' ? (
                  <>
                    <Counter from={0} to={item.to} active={active} />
                    <span className="text-accent-text">{item.suffix}</span>
                  </>
                ) : item.kind === 'delta' ? (
                  <>
                    {/* The arrow carries the meaning visually; spelled out for AT. */}
                    <span aria-hidden="true">
                      <span className="text-muted">{item.from}</span>
                      <span className="text-accent-text">→</span>
                      <Counter from={item.from} to={item.to} active={active} />
                      <span className="ml-1 text-[0.42em] tracking-normal text-muted">
                        {item.unit}
                      </span>
                    </span>
                    <span className="sr-only">
                      {item.from} to {item.to} {item.unit}
                    </span>
                  </>
                ) : (
                  item.value
                )}
              </p>
              <p className="t-stamp mt-3 max-w-[22ch] text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
