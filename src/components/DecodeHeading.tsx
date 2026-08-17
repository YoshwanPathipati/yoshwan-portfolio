'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/hooks';

const GLYPHS = '#/|<>*+=%01ABCDEFGHJKLMNPQRSTUVWXYZ';
const DURATION = 460;

/**
 * A section heading that resolves out of a telemetry readout, once, on first
 * view.
 *
 * The real text is what renders on the server and what sits in the
 * accessibility tree (via aria-label), so a reader never hears a scramble
 * frame and reduced motion never scrambles at all. The animation is written
 * straight to the DOM rather than through state: no re-render per frame.
 *
 * Random glyphs are not the same width as the real ones, so during the
 * scramble the real text stays in place as an invisible sizer and the readout
 * rides over it. The heading therefore holds its final size from the first
 * frame: no reflow, and nothing can overflow its column.
 */
export function DecodeHeading({
  text,
  id,
  className = 't-display-lg',
}: {
  text: string;
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const h = ref.current;
    if (!h || reduced) return;

    const sizer = h.querySelector<HTMLElement>('[data-sizer]');
    const readout = h.querySelector<HTMLElement>('[data-readout]');
    if (!sizer || !readout) return;

    const noise = () =>
      text.replace(/\S/g, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);

    h.classList.add('is-decoding');
    readout.textContent = noise();

    let raf = 0;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / DURATION);
        const eased = 1 - Math.pow(1 - p, 3);
        const resolved = Math.floor(eased * text.length);

        readout.textContent = text
          .split('')
          .map((ch, i) =>
            i < resolved || ch === ' '
              ? ch
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join('');

        if (p < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          readout.textContent = '';
          h.classList.remove('is-decoding');
        }
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        run();
      },
      { threshold: 0.3 },
    );
    io.observe(h);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      readout.textContent = '';
      h.classList.remove('is-decoding');
    };
  }, [text, reduced]);

  return (
    <h2 ref={ref} id={id} aria-label={text} className={className}>
      <span aria-hidden="true" data-sizer>
        {text}
      </span>
      <span aria-hidden="true" data-readout />
    </h2>
  );
}
