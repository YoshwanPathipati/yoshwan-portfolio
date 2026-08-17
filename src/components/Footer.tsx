import { footer } from '@/lib/content';

export function Footer() {
  return (
    <footer
      className="cv-plate border-t border-hairline"
      style={{ '--cv-h': '45px' } as React.CSSProperties}
    >
      <div className="shell flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 py-8 lg:py-10">
        <p className="t-stamp text-muted">{footer.colophon}</p>
        <p className="t-stamp text-muted">{footer.stamp}</p>
      </div>
    </footer>
  );
}
