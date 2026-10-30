import type { Locale } from '@mahalla/shared';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ComingSoon } from '@/components/coming-soon';

/**
 * Temporary catch-all for pages scheduled later (login, listing submission,
 * static pages). Each real route replaces this as it is built. Not indexed.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ComingSoonPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ComingSoon />;
}
