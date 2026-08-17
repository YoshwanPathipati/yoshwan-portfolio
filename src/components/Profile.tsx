import { asset } from '@/lib/asset';
import { profile, site } from '@/lib/content';
import { Reveal } from './Reveal';
import { Section } from './Section';

export function Profile() {
  return (
    <Section id="profile" code={profile.code} title={profile.title} intrinsic={630}>
      <div className="mt-8 grid gap-x-12 gap-y-9 lg:mt-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <Reveal>
          <p className="t-body-lg max-w-[64ch]">{profile.body}</p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="border-t border-hairline pt-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
            {site.hasHeadshot ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={asset('/headshot.jpg')}
                alt={profile.headshotAlt}
                width={640}
                height={800}
                className="mb-6 aspect-4/5 w-full max-w-56 border border-hairline object-cover grayscale"
              />
            ) : null}

            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-3">
              {profile.facts.map((fact) => (
                <div key={fact.label} className="contents">
                  <dt className="t-stamp pt-1 text-muted">{fact.label}</dt>
                  <dd className="text-[0.9375rem]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
