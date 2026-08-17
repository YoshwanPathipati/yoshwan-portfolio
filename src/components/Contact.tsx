import { asset } from '@/lib/asset';
import { contact } from '@/lib/content';
import { Reveal } from './Reveal';
import { Section } from './Section';

export function Contact() {
  const [local, domain] = contact.email.split('@');

  return (
    <Section id="contact" code={contact.code} title={contact.title} intrinsic={260}>
      <Reveal>
        <p className="t-label mt-8 flex items-center gap-2.5 text-muted lg:mt-10">
          <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 bg-accent" />
          {contact.status}
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <a
          href={`mailto:${contact.email}`}
          className="link-u mt-6 inline-block font-display text-[clamp(1.45rem,6.6vw,4.25rem)] leading-[1.02] tracking-[-0.02em] hover:text-accent-text"
          style={{ fontVariationSettings: "'wdth' 102, 'wght' 800" }}
        >
          {local}
          <wbr />
          <span className="text-accent">@</span>
          {domain}
        </a>
      </Reveal>

      <Reveal delay={0.18}>
        <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-hairline pt-5">
          {contact.links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="t-label link-u text-muted transition-colors hover:text-ink"
              >
                {link.label}{' '}
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
          <li>
            <a
              href={asset(contact.resume.href)}
              download
              className="t-label link-u text-muted transition-colors hover:text-ink"
            >
              {contact.resume.label} <span aria-hidden="true">↓</span>
            </a>
          </li>
        </ul>
      </Reveal>
    </Section>
  );
}
