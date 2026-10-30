import { Button, Container } from '@mahalla/ui';
import { Hammer } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { Locale } from '@mahalla/shared';
import { Link } from '@/i18n/navigation';

/**
 * Temporary catch-all for pages scheduled later in Phase 2/3 (search results,
 * property details, agencies, login, listing submission). Each real route
 * replaces this as it is built. Not indexed by search engines.
 */
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ComingSoonPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('comingSoon');
  const tc = await getTranslations('common');

  return (
    <Container className="grid place-items-center py-24 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-gold-100 text-gold-700">
        <Hammer className="size-7" aria-hidden />
      </span>
      <h1 className="mt-5 text-2xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-md text-sand-500">{t('text')}</p>
      <Button asChild className="mt-6">
        <Link href="/">{tc('backHome')}</Link>
      </Button>
    </Container>
  );
}
