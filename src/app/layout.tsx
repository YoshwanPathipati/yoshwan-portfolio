import type { Metadata, Viewport } from 'next';
import { Archivo, IBM_Plex_Mono, Instrument_Sans } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { site } from '@/lib/content';
import './globals.css';

/* Self-hosted at build time by next/font: no runtime request leaves the page,
   and the metrics-matched fallback keeps CLS at zero while they load. */
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
  display: 'swap',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
});

/* All three faces are preloaded. Dropping the mono's preload was measured and
   reverted: the labels and stamps are load-bearing structure across the whole
   page, and letting them swap in late cost CLS 0.12. */
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  keywords: [
    'Yoshwan Pathipati',
    'cloud security',
    'security engineer',
    'AWS Certified Solutions Architect',
    'Virginia Tech computer science',
    'satellite constellation simulation',
    'SpaceNet Testbed',
    'distributed systems',
    'new grad software engineer 2027',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: site.url,
    locale: site.locale,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: `${site.name}: cloud security and distributed systems.`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.title,
    description: site.description,
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf8' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0e12' },
  ],
  colorScheme: 'light dark',
};

/* Runs before first paint: resolves the theme so night ops never flashes white,
   and decides whether the load-in stamp plays (once per session, never under
   reduced motion) so it can be skipped with zero flicker. */
const bootScript = `(function(){var r=document.documentElement;r.setAttribute('data-js','1');try{var s=localStorage.getItem('yp-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;r.setAttribute('data-theme',s==='dark'||s==='light'?s:(d?'dark':'light'));}catch(e){}try{var m=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(m||sessionStorage.getItem('yp-stamped'))r.setAttribute('data-stamped','1');else sessionStorage.setItem('yp-stamped','1');}catch(e){r.setAttribute('data-stamped','1');}})();`;

/* Without the bundle: nothing is mid-animation, so nothing may stay hidden. */
const noScriptStyles = `#stamp-in{display:none!important}[data-reveal]{opacity:1!important;transform:none!important}`;

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: site.name,
  url: site.url,
  email: 'mailto:yoshwanpathipati@vt.edu',
  jobTitle: 'Cybersecurity Intern and Undergraduate Research Assistant',
  description: site.description,
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'Virginia Tech',
    url: 'https://www.vt.edu',
  },
  worksFor: { '@type': 'Organization', name: 'Triple Point Security' },
  knowsAbout: [
    'Cloud security',
    'Vulnerability assessment',
    'Amazon Web Services',
    'Microsoft Azure',
    'Terraform',
    'Docker',
    'Distributed systems',
    'Satellite constellation simulation',
  ],
  knowsLanguage: ['English', 'Hindi', 'Telugu'],
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    name: 'AWS Certified Solutions Architect – Associate',
    credentialCategory: 'certification',
    url: 'https://www.credly.com/badges/7534fd0b-e184-4361-9836-e2d27c96adf2',
  },
  sameAs: [
    'https://linkedin.com/in/yoshwan-pathipati-b9b525269',
    'https://github.com/YoshwanPathipati',
  ],
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${instrumentSans.variable} ${plexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: noScriptStyles }} />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
