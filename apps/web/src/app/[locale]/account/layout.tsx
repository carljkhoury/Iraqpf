import type { Locale } from '@mahalla/shared';
import { Container } from '@mahalla/ui';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { AccountShell } from '@/components/account/account-shell';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = await getTranslations({ locale, namespace: 'auth' });
  // Private pages: never indexed, even after launch.
  return { title: t('myAccount'), robots: { index: false, follow: false } };
}

export default async function AccountLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  setRequestLocale((await params).locale as Locale);
  return (
    <Container className="py-6 sm:py-10">
      <AccountShell>{children}</AccountShell>
    </Container>
  );
}
