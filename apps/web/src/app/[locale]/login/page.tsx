import type { Locale } from '@mahalla/shared';
import { Container } from '@mahalla/ui';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import { LoginFlow } from '@/components/account/login-flow';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth' });
  return { title: t('signIn'), robots: { index: false, follow: false } };
}

export default async function LoginPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Container className="py-10 sm:py-16">
      <Suspense>
        <LoginFlow />
      </Suspense>
    </Container>
  );
}
