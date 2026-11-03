'use client';

import { useEffect, useId, useState } from 'react';
import { asset } from '@/lib/asset';
import { contact, nav, site } from '@/lib/content';
import { scrollToHash } from '@/lib/scroll';
import { ThemeToggle } from './ThemeToggle';

const linkedin = contact.links.find((l) => l.label === 'LinkedIn')!;
const github = contact.links.find((l) => l.label === 'GitHub')!;

export function Nav() {
  const [active, setActive] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

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

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    const wide = window.matchMedia('(min-width: 1024px)');
    const onWide = () => wide.matches && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    wide.addEventListener('change', onWide);
    return () => {
      window.removeEventListener('keydown', onKey);
      wide.removeEventListener('change', onWide);
    };
  }, [menuOpen]);

  return (
    <header className="no-print sticky top-0 z-30 border-b border-hairline bg-paper/95 backdrop-blur-[2px]">
      <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-3">
        <a
          href="#top"
          onClick={(e) => scrollToHash(e, '#top')}
          aria-label={`YP ${site.docNumber}, ${site.name}, back to top`}
          className="flex shrink-0 items-baseline gap-2 text-ink"
        >
          <span className="t-display-sm">YP</span>
          <span className="t-stamp hidden text-muted xl:inline">{site.docNumber}</span>
        </a>

        {/* From lg up every section is named in the bar. Below that the
            numbers alone said nothing, so the list moves into a menu. */}
        <nav aria-label="Sections" className="hidden min-w-0 lg:block">
          <ul className="flex items-center">
            {nav.map((item) => {
              const isActive = active === item.href;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => scrollToHash(e, item.href)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`t-stamp relative inline-flex items-center gap-1.5 px-2 py-2.5 transition-colors xl:px-2.5 ${
                      isActive ? 'text-ink' : 'text-muted hover:text-ink'
                    }`}
                  >
                    <span aria-hidden="true" className="hidden 2xl:inline">
                      {item.code}
                    </span>
                    {item.label}
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-2 bottom-1 h-px bg-accent xl:inset-x-2.5"
                      />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <a
            href={linkedin.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted transition-colors hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>

          <a
            href={github.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted transition-colors hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.089-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>

          <a
            href={asset(contact.resume.href)}
            target="_blank"
            rel="noopener noreferrer"
            className="t-stamp border border-ink px-2.5 py-1.5 text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            Résumé
          </a>

          <ThemeToggle />

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
            className="t-stamp inline-flex items-center gap-2 border border-hairline px-2.5 py-1.5 text-muted transition-colors hover:border-accent hover:text-ink lg:hidden"
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
              <path
                d={menuOpen ? 'M2 2l8 8M10 2l-8 8' : 'M1 3h10M1 6h10M1 9h10'}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
            Menu
          </button>
        </div>
      </div>

      <nav
        id={menuId}
        aria-label="Sections"
        hidden={!menuOpen}
        className="border-t border-hairline bg-paper lg:hidden"
      >
        <ul className="shell grid grid-cols-1 py-2 sm:grid-cols-2">
          {nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => {
                  setMenuOpen(false);
                  scrollToHash(e, item.href);
                }}
                aria-current={active === item.href ? 'true' : undefined}
                className="flex items-baseline gap-4 border-b border-hairline py-3.5 text-ink"
              >
                <span aria-hidden="true" className="t-stamp text-accent-text">
                  {item.code}
                </span>
                <span className="t-display-sm">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
