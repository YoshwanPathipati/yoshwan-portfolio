/**
 * In-page navigation, used by every anchor link on the page (nav, logo, CTA).
 *
 * `scroll-behavior: smooth` is deliberately NOT set globally: it applies to
 * every scroll source, including rapid wheel/trackpad input, and a burst of
 * wheel events each requesting their own smooth-scroll animation can queue
 * and fight the browser's compositor. So wheel/trackpad/keyboard scrolling
 * stays native and instant (the most robust path), and only a deliberate
 * click on an anchor gets an explicit, one-shot smooth scroll via this
 * function, which the browser can animate without any competing input.
 */
export function scrollToHash(e: React.MouseEvent<HTMLAnchorElement>, hash: string) {
  const id = hash.replace(/^#/, '');
  const target = id ? document.getElementById(id) : document.body;
  if (!target) return;

  e.preventDefault();

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });

  if (history.pushState) history.pushState(null, '', hash);
}
