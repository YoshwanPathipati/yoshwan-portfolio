import type { Metadata } from 'next';
import { asset } from '@/lib/asset';
import { contact, site } from '@/lib/content';

export const metadata: Metadata = {
  title: `Page not found | ${site.name}`,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main id="main" className="shell flex min-h-[80svh] flex-col justify-center py-16">
      <p className="t-label flex items-center gap-2.5 text-muted">
        <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 bg-accent" />
        ERR 404 / DOC NO. {site.docNumber}
      </p>
      <hr className="rule mt-4" />
      <h1 className="t-display-lg mt-8">This page isn&apos;t in the document</h1>
      <p className="t-body-lg mt-5 max-w-[48ch] text-muted">
        The link may be out of date. Everything about {site.name} is on the main page.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a href={asset('/')} className="btn btn-primary">
          Back to the portfolio
        </a>
        <a
          href={asset(contact.resume.href)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
        >
          {contact.resume.label}
        </a>
      </div>
    </main>
  );
}
