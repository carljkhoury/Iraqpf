import type { Locale } from '@mahalla/shared';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ComingSoon } from '@/components/coming-soon';

// Agency sign-up arrives with advertiser accounts (Phase 3).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'agencies' });
  return { title: t('registerPageTitle'), robots: { index: false, follow: false } };
}

export default async function RegisterAgencyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('agencies');
  return <ComingSoon title={t('registerPageTitle')} />;
}
