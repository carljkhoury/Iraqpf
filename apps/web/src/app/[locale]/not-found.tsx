import { Button, Container } from '@mahalla/ui';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('notFound');
  const tc = useTranslations('common');
  return (
    <Container className="grid place-items-center py-24 text-center">
      <p className="text-5xl font-bold text-lapis-600 ltr-isolate">404</p>
      <h1 className="mt-4 text-2xl font-bold">{t('title')}</h1>
      <p className="mt-2 max-w-md text-sand-500">{t('text')}</p>
      <Button asChild className="mt-6">
        <Link href="/">{tc('backHome')}</Link>
      </Button>
    </Container>
  );
}
