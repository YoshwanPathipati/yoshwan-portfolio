import { research } from '@/lib/content';
import { Reveal } from './Reveal';
import { Section } from './Section';

export function FeaturedResearch() {
  return (
    <Section
      id="research"
      code={research.code}
      title={research.title}
      intrinsic={890}
      className="border-y border-hairline bg-panel"
    >
      <Reveal>
        <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2 lg:mt-10">
          <h3 className="t-display-md">{research.name}</h3>
          <p className="t-stamp text-accent-text">Hume Center / Virginia Tech</p>
        </div>

        <p className="t-body-lg mt-5 max-w-[34ch] text-[clamp(1.25rem,2.4vw,1.75rem)] leading-[1.25] text-balance">
          {research.lede}
        </p>
      </Reveal>

      <div className="mt-9 grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Reveal delay={0.12}>
          <p className="max-w-[64ch]">{research.body}</p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="border-t border-hairline pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            <p className="t-stamp mb-4 text-muted">Specification</p>
            <dl className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-x-4 gap-y-3">
              {research.spec.map((row) => (
                <div key={row.label} className="contents">
                  <dt className="t-stamp pt-1 text-muted">{row.label}</dt>
                  <dd className="text-[0.9375rem]">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
