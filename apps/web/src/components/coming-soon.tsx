import { Button, Container } from '@mahalla/ui';
import { Hammer } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

/** Placeholder for pages scheduled in a later step. */
export async function ComingSoon({ title }: { title?: string }) {
  const t = await getTranslations('comingSoon');
  const tc = await getTranslations('common');
  return (
    <Container className="grid place-items-center py-24 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-gold-100 text-gold-700">
        <Hammer className="size-7" aria-hidden />
      </span>
      <h1 className="mt-5 text-2xl font-bold">{title ?? t('title')}</h1>
      <p className="mt-2 max-w-md text-sand-500">{t('text')}</p>
      <Button asChild className="mt-6">
        <Link href="/">{tc('backHome')}</Link>
      </Button>
    </Container>
  );
}
