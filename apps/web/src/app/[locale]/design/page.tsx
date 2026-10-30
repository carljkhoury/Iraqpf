import type { Locale } from '@mahalla/shared';
import { Badge, Button, Container } from '@mahalla/ui';
import { BadgeCheck, MessageCircle, Star } from 'lucide-react';
import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { ReactNode } from 'react';
import { use } from 'react';
import { BedroomChips, PhoneDemo } from '@/components/design/interactive-demos';
import { PropertyCard } from '@/components/property-card';
import { SAMPLE_LISTINGS } from '@/lib/sample-data';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'design' });
  return { title: t('title'), robots: { index: false, follow: false } };
}

const SWATCHES = [
  ['lapis', [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]],
  ['gold', [50, 100, 300, 500, 700]],
  ['sand', [25, 50, 100, 200, 300, 500, 700, 900]],
] as const;

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-sand-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function DesignPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('design');
  const tl = useTranslations('listing');

  return (
    <Container className="grid gap-6 py-10">
      <div>
        <h1 className="text-3xl font-bold">{t('title')}</h1>
        <p className="mt-2 max-w-2xl text-sand-500">{t('intro')}</p>
      </div>

      <Block title={t('colors')}>
        <div className="grid gap-4">
          {SWATCHES.map(([name, steps]) => (
            <div key={name} className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-2">
              {steps.map((step) => (
                <div
                  key={step}
                  className="overflow-hidden rounded-sm border border-sand-200 text-[11px]"
                >
                  <div className="h-10" style={{ background: `var(--color-${name}-${step})` }} />
                  <div className="px-2 py-1 font-latin text-sand-700" dir="ltr">
                    {name}-{step}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Block>

      <div className="grid gap-6 lg:grid-cols-2">
        <Block title={t('typography')}>
          <p className="text-3xl font-bold text-sand-900">{t('sampleHeading')}</p>
          <p className="mt-2 text-lg">{t('sampleBody')}</p>
          <p className="mt-2 text-sm text-sand-500">
            {tl('beds', { count: 3 })} · {tl('baths', { count: 2 })}
          </p>
        </Block>
        <Block title={t('forms')}>
          <div className="grid gap-5">
            <PhoneDemo />
            <BedroomChips />
          </div>
        </Block>
        <Block title={t('buttons')}>
          <div className="flex flex-wrap gap-3">
            <Button>{t('buttonPrimary')}</Button>
            <Button variant="secondary">{t('buttonSecondary')}</Button>
            <Button variant="ghost">{t('buttonGhost')}</Button>
            <Button variant="danger">{t('buttonDanger')}</Button>
            <Button variant="whatsapp">
              <MessageCircle className="size-4" aria-hidden />
              {t('buttonWhatsapp')}
            </Button>
            <Button variant="gold">{t('buttonPrimary')}</Button>
          </div>
        </Block>
        <Block title={t('badges')}>
          <div className="flex flex-wrap gap-2">
            <Badge tone="featured">
              <Star className="fill-current" aria-hidden />
              {tl('featured')}
            </Badge>
            <Badge tone="verified">
              <BadgeCheck aria-hidden />
              {tl('verified')}
            </Badge>
            <Badge tone="new">{t('badgeNew')}</Badge>
            <Badge tone="pending">{t('badgePending')}</Badge>
            <Badge tone="expired">{t('badgeExpired')}</Badge>
          </div>
        </Block>
      </div>

      <Block title={t('cards')}>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {SAMPLE_LISTINGS.slice(3, 7).map((listing) => (
            <PropertyCard key={listing.id} listing={listing} />
          ))}
        </div>
      </Block>
    </Container>
  );
}
