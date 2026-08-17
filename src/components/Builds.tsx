import { builds } from '@/lib/content';
import { Reveal } from './Reveal';
import { Section } from './Section';

export function Builds() {
  return (
    <Section
      id="builds"
      code={builds.code}
      title={builds.title}
      intrinsic={1120}
    >
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3">
        {builds.items.map((build, i) => (
          <li key={build.ref} className="flex">
            <Reveal delay={i * 0.08} className="flex w-full">
              <article className="group relative flex w-full flex-col border border-hairline p-6 transition-transform duration-300 ease-out hover:-translate-y-0.5">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100"
                />

                <p className="t-stamp flex items-baseline gap-2 text-muted">
                  <span className="text-accent-text">{build.ref}</span>
                  <span>{build.year}</span>
                </p>

                <h3 className="t-display-md mt-3 text-balance">{build.name}</h3>

                <p className="mt-4 text-[0.9375rem] text-muted">{build.body}</p>

                <ul className="mt-auto flex flex-wrap gap-1.5 pt-6">
                  {build.tags.map((tag) => (
                    <li key={tag} className="tag">
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
