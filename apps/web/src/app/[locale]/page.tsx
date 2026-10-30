import { Container } from '@mahalla/ui';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { use } from 'react';
import { AgencyCard } from '@/components/agency-card';
import { CategoryGrid } from '@/components/category-grid';
import { HeroSearch } from '@/components/hero-search';
import { ListPropertyCta } from '@/components/list-property-cta';
import { LocationTile } from '@/components/location-tile';
import { PropertyCard } from '@/components/property-card';
import { SectionHeader } from '@/components/section-header';
import type { Locale } from '@mahalla/shared';
import { Link } from '@/i18n/navigation';
import { searchPath } from '@/lib/catalog';
import { SAMPLE_AGENCIES, SAMPLE_LISTINGS, SAMPLE_POPULAR_AREAS } from '@/lib/sample-data';

export default function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations('home');
  const th = useTranslations('hero');
  const tc = useTranslations('common');

  const featured = SAMPLE_LISTINGS.filter((l) => l.featured).slice(0, 4);
  const recent = SAMPLE_LISTINGS.filter((l) => !l.featured)
    .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
    .slice(0, 4);
  const quickSearches = SAMPLE_POPULAR_AREAS.slice(0, 5);

  return (
    <>
      <section className="relative overflow-hidden bg-lapis-900">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '100% 22px, 44px 44px, 44px 44px',
            backgroundPosition: '0 0, 0 0, 22px 22px',
          }}
        />
        <Container className="relative py-10 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <h1 className="text-[32px] leading-tight font-bold text-white sm:text-5xl sm:leading-tight">
              {th('title')}
            </h1>
            <p className="mt-3 text-base text-lapis-100 sm:text-lg">{th('subtitle')}</p>
          </div>
          <div className="mt-7 max-w-4xl">
            <HeroSearch />
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-lapis-200">
              <span>{th('popular')}</span>
              {quickSearches.map((area) => (
                <Link
                  key={area.path}
                  href={searchPath('buy', 'properties', area.path)}
                  className="text-white underline-offset-4 hover:underline"
                >
                  {area.name[locale]}
                </Link>
              ))}
            </p>
          </div>
        </Container>
      </section>

      <Container className="grid gap-14 py-12 sm:py-16">
        <section aria-labelledby="featured">
          <SectionHeader
            id="featured"
            title={t('featuredTitle')}
            subtitle={t('featuredSubtitle')}
            action={{ href: searchPath('buy', 'properties'), label: tc('viewAll') }}
          />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {featured.map((listing, i) => (
              <PropertyCard key={listing.id} listing={listing} priority={i < 2} />
            ))}
          </div>
        </section>

        <section aria-labelledby="types">
          <SectionHeader id="types" title={t('typesTitle')} />
          <CategoryGrid />
        </section>

        <section aria-labelledby="recent">
          <SectionHeader
            id="recent"
            title={t('recentTitle')}
            subtitle={t('recentSubtitle')}
            action={{ href: searchPath('rent', 'properties'), label: tc('viewAll') }}
          />
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {recent.map((listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>

        <section aria-labelledby="areas">
          <SectionHeader id="areas" title={t('locationsTitle')} subtitle={t('locationsSubtitle')} />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {SAMPLE_POPULAR_AREAS.map((area, i) => (
              <LocationTile key={area.path} area={area} index={i} />
            ))}
          </div>
        </section>

        <section aria-labelledby="agencies">
          <SectionHeader
            id="agencies"
            title={t('agenciesTitle')}
            subtitle={t('agenciesSubtitle')}
            action={{ href: '/agencies', label: tc('viewAll') }}
          />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {SAMPLE_AGENCIES.map((agency) => (
              <AgencyCard key={agency.slug} agency={agency} />
            ))}
          </div>
        </section>
      </Container>

      <ListPropertyCta />
    </>
  );
}
