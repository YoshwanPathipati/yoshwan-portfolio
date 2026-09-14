import { asset } from '@/lib/asset';
import { hero } from '@/lib/content';
import { MagneticLink } from './MagneticLink';
import { OrbitalPlot } from './OrbitalPlot';

export function Hero() {
  const lines = hero.headline;
  const last = lines[lines.length - 1];

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="pt-9 pb-[clamp(2.5rem,6vh,4rem)] lg:pt-14"
    >
      <div className="shell">
        <p className="t-label flex items-center gap-2.5 text-muted">
          <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 bg-accent" />
          <span className="min-w-0">{hero.eyebrow}</span>
        </p>

        <hr className="rule mt-4" />

        {/* The headline gets the full measure of the sheet. */}
        <h1 id="hero-title" className="t-display-xl mt-7 lg:mt-9">
          {lines.slice(0, -1).map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
          <span className="block">
            {last.replace(/\.$/, '')}
            <span className="text-accent">.</span>
          </span>
        </h1>

        <div className="mt-9 grid gap-x-12 gap-y-9 lg:mt-11 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-end">
          <div className="min-w-0">
            <p className="t-body-lg max-w-[44ch] text-muted">{hero.sub}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticLink href={hero.primaryCta.href} className="btn btn-primary">
                {hero.primaryCta.label}
              </MagneticLink>

              <a href={asset(hero.secondaryCta.href)} download className="btn btn-ghost">
                {hero.secondaryCta.label}
                <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                  <path
                    d="M6 1v8m0 0L3 6.2M6 9l3-2.8M1.5 11h9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              </a>

              <a
                href={asset(hero.tertiaryCta.href)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                {hero.tertiaryCta.label}
                <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                  <path
                    d="M7 2H2v8h8V5M5.3 6.7 10 2M7 2h3v3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              </a>
            </div>
          </div>

          <div className="min-w-0">
            <OrbitalPlot />
          </div>
        </div>
      </div>
    </section>
  );
}
