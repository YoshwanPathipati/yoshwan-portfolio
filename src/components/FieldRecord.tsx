import { fieldRecord, type Role } from '@/lib/content';
import { Reveal } from './Reveal';
import { Section } from './Section';

function Entry({ role, delay = 0 }: { role: Role; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <article className="grid gap-y-4 border-t border-hairline py-8 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:gap-x-10">
        <div className="lg:pt-1">
          <p className="t-stamp text-accent-text">{role.ref}</p>
          <p className="t-label mt-2 text-ink">{role.dates}</p>
          {role.place ? <p className="t-stamp mt-2 text-muted">{role.place}</p> : null}
        </div>

        <div className="min-w-0">
          <h3 className="t-display-md">{role.org}</h3>
          <p className="t-label mt-2 text-muted">{role.role}</p>

          <ul className="mt-5 space-y-3.5">
            {role.bullets.map((bullet) => (
              <li key={bullet} className="relative max-w-[68ch] pl-6 text-[0.9375rem]">
                <span
                  aria-hidden="true"
                  className="absolute top-[0.7em] left-0 h-px w-3.5 bg-accent"
                />
                {bullet}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  );
}

export function FieldRecord() {
  return (
    <Section
      id="field-record"
      code={fieldRecord.code}
      title={fieldRecord.title}
      intrinsic={2020}
    >
      <div className="mt-8 lg:mt-10">
        {fieldRecord.primary.map((role, i) => (
          <Entry key={role.ref} role={role} delay={i === 0 ? 0 : 0.05} />
        ))}

        <details className="group border-t border-hairline">
          <summary className="t-label flex items-center gap-3 py-5 text-muted transition-colors hover:text-ink">
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 rotate-[-45deg] border-r border-b border-current transition-transform group-open:rotate-[45deg]"
            />
            {fieldRecord.secondaryLabel}
          </summary>
          <div className="pb-2">
            {fieldRecord.secondary.map((role) => (
              <Entry key={role.ref} role={role} />
            ))}
          </div>
        </details>
      </div>
    </Section>
  );
}
