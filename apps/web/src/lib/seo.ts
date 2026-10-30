import type { Locale } from '@mahalla/shared';
import type { Metadata } from 'next';

/**
 * Public base URL for canonical and hreflang links. Set NEXT_PUBLIC_SITE_URL
 * once the real domain exists; on Vercel previews we fall back to the
 * project's production address, locally to localhost.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

/** Locale-prefixed path: Arabic at the root, English under /en (decision Q-03). */
export function localizedPath(locale: Locale, path: string): string {
  if (locale === 'ar') return path;
  return path === '/' ? '/en' : `/en${path}`;
}

/** Canonical URL plus hreflang alternates for every page. */
export function alternates(locale: Locale, path: string): Metadata['alternates'] {
  return {
    canonical: localizedPath(locale, path),
    languages: {
      ar: localizedPath('ar', path),
      en: localizedPath('en', path),
      'x-default': localizedPath('ar', path),
    },
  };
}

/**
 * Search engines are blocked until launch. Set NEXT_PUBLIC_ALLOW_INDEXING=true
 * in the production environment on launch day to open the site to Google.
 */
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true';
