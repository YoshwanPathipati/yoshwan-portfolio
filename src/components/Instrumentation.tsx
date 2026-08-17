import { instrumentation } from '@/lib/content';
import { Reveal } from './Reveal';
import { Section } from './Section';

export function Instrumentation() {
  return (
    <Section
      id="instrumentation"
      code={instrumentation.code}
      title={instrumentation.title}
      intrinsic={750}
    >
      <div className="mt-8 grid gap-x-12 gap-y-8 lg:mt-10 lg:grid-cols-2">
        {instrumentation.groups.map((group, i) => (
          <Reveal key={group.ref} delay={i * 0.07}>
            <div className="border-t border-hairline pt-5">
              <p className="t-stamp flex items-baseline gap-2 text-muted">
                <span className="text-accent-text">{group.ref}</span>
                <span>{group.name}</span>
              </p>

              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="border-l border-hairline pl-2.5 text-[0.9375rem]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
