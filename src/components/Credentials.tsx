import { credentials } from '@/lib/content';
import { Reveal } from './Reveal';
import { Section } from './Section';

export function Credentials() {
  const { education } = credentials;

  return (
    <Section
      id="credentials"
      code={credentials.code}
      title={credentials.title}
      intrinsic={780}
    >
      <div className="mt-8 grid gap-x-12 gap-y-8 lg:mt-10 lg:grid-cols-2">
        <Reveal>
          <div className="border-t border-hairline pt-5">
            <p className="t-stamp text-muted">Certifications</p>
            <ul className="mt-4 space-y-4">
              {credentials.certifications.map((cert) => (
                <li key={cert.name}>
                  <p className="t-display-sm">{cert.name}</p>
                  <p className="t-stamp mt-1.5 flex flex-wrap items-baseline gap-x-3 text-muted">
                    {cert.meta ? <span>{cert.meta}</span> : null}
                    {'href' in cert && cert.href ? (
                      <a
                        href={cert.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-u text-accent-text"
                      >
                        {cert.hrefLabel} <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="border-t border-hairline pt-5">
            <p className="t-stamp text-muted">Education</p>
            <p className="t-display-sm mt-4">{education.school}</p>
            <p className="mt-1 text-[0.9375rem]">
              {education.degree} <span className="text-muted">/ {education.dates}</span>
            </p>

            <dl className="mt-5 grid grid-cols-[6rem_minmax(0,1fr)] gap-x-4 gap-y-3">
              {education.details.map((detail) => (
                <div key={detail.label} className="contents">
                  <dt className="t-stamp pt-1 text-muted">{detail.label}</dt>
                  <dd className="text-[0.9375rem]">{detail.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
