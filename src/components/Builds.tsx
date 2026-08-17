import { builds } from '@/lib/content';
import { Reveal } from './Reveal';
import { Section } from './Section';

export function Builds() {
  return (
    <Section id="builds" code={builds.code} title={builds.title} intrinsic={4200}>
      <p className="t-stamp mt-3 text-muted">{builds.subLabel}</p>

      <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3">
        {builds.items.map((build, i) => (
          <li key={build.codename} className="flex">
            <Reveal delay={i * 0.06} className="flex w-full">
              <article className="group relative flex w-full flex-col border border-hairline p-6 transition-transform duration-300 ease-out hover:-translate-y-0.5">
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100"
                />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="t-stamp text-accent-text">{build.codename}</p>
                  <span className="lane-badge">{build.lane}</span>
                </div>

                <h3 className="t-display-md mt-3 text-balance">{build.title}</h3>

                <p className="mt-4 text-[0.9375rem]">{build.oneLiner}</p>

                <p className="mt-3 text-[0.875rem] text-muted">
                  {build.problem} {build.build}
                </p>

                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {build.stack.map((tech) => (
                    <li key={tech} className="tag">
                      {tech}
                    </li>
                  ))}
                </ul>

                <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-1.5">
                  {build.metrics.map((metric) => (
                    <li key={metric} className="t-stamp flex items-center gap-1.5 text-muted">
                      <span aria-hidden="true" className="inline-block h-1 w-1 shrink-0 bg-accent" />
                      {metric}
                    </li>
                  ))}
                </ul>

                {/* Every card closes the same way: real links when they exist,
                    a status stamp in that same slot when they do not yet. The
                    plan is never left claiming a demo or repo that isn't live. */}
                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hairline pt-4">
                  {build.demoUrl || build.repoUrl ? (
                    <>
                      {build.demoUrl ? (
                        <a
                          href={build.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="t-stamp link-u inline-flex w-fit items-center gap-1.5 text-muted transition-colors hover:text-ink"
                        >
                          <span>View demo</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      ) : null}
                      {build.repoUrl ? (
                        <a
                          href={build.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="t-stamp link-u inline-flex w-fit items-center gap-1.5 text-muted transition-colors hover:text-ink"
                        >
                          <span>Source</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      ) : null}
                    </>
                  ) : (
                    <p className="t-stamp text-muted">STATUS: {build.status}</p>
                  )}
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
