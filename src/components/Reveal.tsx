/**
 * Scroll reveal: translate + fade, once per element.
 *
 * This is a plain server component. It only marks the element; a single
 * client-side observer (`RevealObserver`, mounted once) drives every reveal on
 * the page. Keeping it off the client boundary means the wrapped content is not
 * serialised into the RSC payload, which is most of what this page costs to
 * hydrate.
 *
 * The hidden state lives in CSS gated on `data-js` (set pre-paint by the inline
 * boot script), so there is no flash of visible-then-hidden content, and the
 * page is fully readable if the bundle never runs.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  /** Seconds. Stagger siblings by 0.15–0.25. */
  delay?: number;
}) {
  return (
    <div
      data-reveal
      className={className}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
