import type { Locale } from '@mahalla/shared';
import { Button, Container, cn } from '@mahalla/ui';
import { Search, SearchX } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { DirectoryCard } from '@/components/agency/directory-card';
import { Breadcrumbs } from '@/components/search/breadcrumbs';
import { Link } from '@/i18n/navigation';
import { agencyStats, listAgencies } from '@/lib/listings-repo';
import { alternates } from '@/lib/seo';

const CITIES = ['baghdad', 'erbil', 'basra'] as const;

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ city?: string; q?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'agencies' });
  return {
    title: t('title'),
    description: t('metaDescription'),
    alternates: alternates(locale, '/agencies'),
  };
}

export default async function AgenciesPage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { city: rawCity, q = '' } = await searchParams;
  const city = CITIES.find((c) => c === rawCity);
  const agencies = listAgencies({ city, q });
  const t = await getTranslations('agencies');
  const ts = await getTranslations('search');
  const tn = await getTranslations('nav');
  const cityNames = {
    baghdad: { ar: 'بغداد', en: 'Baghdad' },
    erbil: { ar: 'أربيل', en: 'Erbil' },
    basra: { ar: 'البصرة', en: 'Basra' },
  };

  const cityHref = (c?: string) => {
    const query = new URLSearchParams({
      ...(c ? { city: c } : {}),
      ...(q ? { q } : {}),
    }).toString();
    return query ? `/agencies?${query}` : '/agencies';
  };

  return (
    <>
      <Container className="py-6 sm:py-8">
        <Breadcrumbs items={[{ label: ts('home'), href: '/' }, { label: tn('agencies') }]} />
        <div className="mt-3 max-w-2xl">
          <h1 className="text-2xl font-bold sm:text-[28px]">{t('title')}</h1>
          <p className="mt-1 text-sand-500">{t('subtitle')}</p>
        </div>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <form action="" method="get" role="search" className="flex w-full max-w-md gap-2">
            {city && <input type="hidden" name="city" value={city} />}
            <label htmlFor="agency-q" className="sr-only">
              {t('searchLabel')}
            </label>
            <input
              id="agency-q"
              name="q"
              type="search"
              defaultValue={q}
              placeholder={t('searchPlaceholder')}
              className="h-11 min-w-0 flex-1 rounded-md border border-sand-200 bg-white px-3 text-[15px] focus:border-lapis-500 focus:outline-2 focus:outline-lapis-200"
            />
            <Button type="submit">
              <Search className="size-4" aria-hidden />
              {t('searchButton')}
            </Button>
          </form>
          <nav aria-label={t('allCities')} className="flex flex-wrap gap-2">
            {[undefined, ...CITIES].map((c) => {
              const active = c === city;
              return (
                <Link
                  key={c ?? 'all'}
                  href={cityHref(c)}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors',
                    active
                      ? 'border-lapis-600 bg-lapis-600 text-white'
                      : 'border-sand-200 bg-white text-sand-700 hover:bg-lapis-50',
                  )}
                >
                  {c ? cityNames[c][locale] : t('allCities')}
                </Link>
              );
            })}
          </nav>
        </div>

        <p className="mt-6 text-sm text-sand-500" aria-live="polite">
          {t('count', { count: agencies.length })}
        </p>

        {agencies.length === 0 ? (
          <div className="mt-4 grid place-items-center rounded-lg border border-dashed border-sand-300 bg-white px-6 py-16 text-center">
            <SearchX className="size-10 text-sand-300" aria-hidden />
            <h2 className="mt-4 text-lg font-semibold">{t('emptyTitle')}</h2>
            <p className="mt-1 text-sm text-sand-500">{t('emptyText')}</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {agencies.map((agency) => {
              const stats = agencyStats(agency.slug);
              return (
                <DirectoryCard
                  key={agency.slug}
                  agency={agency}
                  sale={stats.sale}
                  rent={stats.rent}
                />
              );
            })}
          </div>
        )}
      </Container>

      <section className="border-t border-sand-200 bg-white">
        <Container className="flex flex-col items-start justify-between gap-5 py-10 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold">{t('registerTitle')}</h2>
            <p className="mt-1 text-sand-500">{t('registerText')}</p>
          </div>
          <Button asChild size="lg">
            <Link href="/agencies/register">{t('registerButton')}</Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
