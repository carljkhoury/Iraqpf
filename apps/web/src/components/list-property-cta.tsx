import { Button, Container } from '@mahalla/ui';
import { BarChart3, Check, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function ListPropertyCta() {
  const t = useTranslations('home');
  const points = [
    { key: 'free', Icon: Check },
    { key: 'whatsapp', Icon: MessageCircle },
    { key: 'stats', Icon: BarChart3 },
  ] as const;

  return (
    <section aria-labelledby="cta-title" className="bg-lapis-900">
      <Container className="grid items-center gap-8 py-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:py-16">
        <div>
          <h2 id="cta-title" className="text-2xl font-bold text-white sm:text-3xl">
            {t('ctaTitle')}
          </h2>
          <p className="mt-3 max-w-[56ch] text-lapis-100">{t('ctaText')}</p>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {points.map(({ key, Icon }) => (
              <li key={key} className="inline-flex items-center gap-2 text-sm text-white">
                <span className="grid size-6 place-items-center rounded-full bg-gold-500 text-lapis-900">
                  <Icon className="size-3.5" aria-hidden />
                </span>
                {t(`ctaPoints.${key}`)}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col md:items-stretch lg:flex-row lg:justify-end">
          <Button asChild variant="gold" size="lg">
            <Link href="/list-property">{t('ctaButton')}</Link>
          </Button>
          <Button asChild variant="inverse" size="lg">
            <Link href="/agencies/register">{t('ctaAgency')}</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
