import type { Locale } from '@mahalla/shared';
import { redirect } from '@/i18n/navigation';

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  redirect({ href: '/buy/residential', locale });
}
