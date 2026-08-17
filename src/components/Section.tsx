import { DecodeHeading } from './DecodeHeading';

type Props = {
  id: string;
  code: string;
  title: string;
  children: React.ReactNode;
  /**
   * Roughly how tall this plate is on a phone, in px. Used as the
   * `contain-intrinsic-size` hint while the section is still skipped, so the
   * scrollbar barely drifts as plates render. Only an estimate; the browser
   * substitutes the real size once the section has been laid out.
   */
  intrinsic: number;
  className?: string;
};

/**
 * One numbered plate of the document: margin rail on the left carrying the
 * section code, record on the right.
 */
export function Section({ id, code, title, children, intrinsic, className = '' }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      style={{ '--cv-h': `${intrinsic}px` } as React.CSSProperties}
      className={`cv-plate py-[clamp(3rem,7vh,5.5rem)] ${className}`}
    >
      <div className="shell">
        <div className="sec-grid">
          <div className="rail flex items-center gap-3 lg:block">
            <span className="inline-block h-1.5 w-1.5 shrink-0 bg-accent" aria-hidden="true" />
            <p className="t-stamp">{code}</p>
            <hr className="rule mt-4 hidden lg:block" />
          </div>

          <div className="min-w-0">
            <DecodeHeading id={`${id}-title`} text={title} />
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
