'use client';

import { useEffect, useState } from 'react';
import { nav, site } from '@/lib/content';
import { scrollToHash } from '@/lib/scroll';
import { ThemeToggle } from './ThemeToggle';

export function Nav() {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const sections = nav
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 },
    );

    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Off-screen sections start with `content-visibility: auto` for a much
  // cheaper first load. Release it on the visitor's first touch of the page,
  // which always precedes activating a link, so anchor scrolling is measured
  // against real layout rather than the intrinsic-size estimate.
  useEffect(() => {
    const settle = () => document.documentElement.setAttribute('data-layout-settled', '1');
    const opts = { once: true, passive: true } as const;
    window.addEventListener('pointerdown', settle, opts);
    window.addEventListener('keydown', settle, opts);
    return () => {
      window.removeEventListener('pointerdown', settle);
      window.removeEventListener('keydown', settle);
    };
  }, []);

  return (
    <header className="no-print sticky top-0 z-30 border-b border-hairline bg-paper/95 backdrop-blur-[2px]">
      <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-3">
        <a
          href="#top"
          onClick={(e) => scrollToHash(e, '#top')}
          aria-label={`YP ${site.docNumber}, back to top`}
          className="t-stamp flex shrink-0 items-baseline gap-2 text-ink"
        >
          <span className="t-display-sm">YP</span>
          <span className="hidden text-muted sm:inline">{site.docNumber}</span>
        </a>

        <nav aria-label="Sections" className="min-w-0">
          <ul className="flex items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {nav.map((item) => {
              const isActive = active === item.href;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => scrollToHash(e, item.href)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`t-stamp relative inline-flex items-center gap-1.5 px-1.5 py-2.5 transition-colors sm:px-2.5 ${
                      isActive ? 'text-ink' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {/* The code stays in the accessible name so it matches the
                        visible label, which is all a reader sees below xl. */}
                    <span>{item.code}</span>
                    <span className="hidden xl:inline">{item.label}</span>
                    <span className="sr-only xl:hidden">{item.label}</span>
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-1.5 bottom-1 h-px bg-accent sm:inset-x-2.5"
                      />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
