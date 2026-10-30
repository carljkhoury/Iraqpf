import type { Locale } from '@mahalla/shared';
import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

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
