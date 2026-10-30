import type { Locale } from '@mahalla/shared';
import { Badge, Container, cn } from '@mahalla/ui';
import { BadgeCheck, CalendarDays, Clock, Languages, MapPin } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { AgencyLogo } from '@/components/agency/agency-logo';
import { AgentCard } from '@/components/agency/agent-card';
import { AreaMapLoader } from '@/components/map/area-map-loader';
import { PropertyCard } from '@/components/property-card';
import { ContactButtons } from '@/components/property/contact';
import { ShareButton } from '@/components/property/share-button';
import { Breadcrumbs } from '@/components/search/breadcrumbs';
import { Pagination } from '@/components/search/pagination';
import { Link, getPathname } from '@/i18n/navigation';
import { agencyListings, agencyStats, getAgency } from '@/lib/listings-repo';
import { SAMPLE_AGENCIES } from '@/lib/sample-data';
import { SITE_URL, alternates } from '@/lib/seo';
import { routing } from '@/i18n/routing';

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
  searchParams: Promise<{ tab?: string; page?: string }>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SAMPLE_AGENCIES.map((a) => ({ locale, slug: a.slug })),
  );
}

function load(slug: string) {
  const agency = getAgency(slug);
  if (!agency) notFound();
  return agency;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const agency = load(slug);
  return {
    title: `${agency.name[locale]} · ${agency.city[locale]}`,
    description: agency.about[locale].slice(0, 160),
    alternates: alternates(locale, `/agencies/${agency.slug}`),
  };
}

export default async function AgencyPage({ params, searchParams }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const agency = load(slug);
  const { tab: rawTab, page: rawPage } = await searchParams;
  const stats = agencyStats(agency.slug);
  // Open on whichever side has listings when no tab is chosen.
  const tab: 'sale' | 'rent' =
    rawTab === 'rent' || rawTab === 'sale' ? rawTab : stats.sale > 0 ? 'sale' : 'rent';
  const listings = agencyListings(agency.slug, tab, Number(rawPage) || 1);

  const t = await getTranslations('agencies');
  const ts = await getTranslations('search');
  const tn = await getTranslations('nav');
  const basePath = `/agencies/${agency.slug}`;
  const pageUrl = `${SITE_URL}${getPathname({ href: basePath, locale })}`;
  const tabHref = (value: 'sale' | 'rent', page = 1) => {
    const q = new URLSearchParams({ tab: value, ...(page > 1 ? { page: String(page) } : {}) });
    return `${basePath}?${q}`;
  };
  const sep = locale === 'ar' ? '، ' : ', ';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: agency.name[locale],
    description: agency.about[locale],
    url: pageUrl,
    telephone: agency.phone,
    foundingDate: String(agency.established),
    address: {
      '@type': 'PostalAddress',
      streetAddress: agency.office.address[locale],
      addressLocality: agency.city[locale],
      addressCountry: 'IQ',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="py-6 sm:py-8">
        <Breadcrumbs
          items={[
            { label: ts('home'), href: '/' },
            { label: tn('agencies'), href: '/agencies' },
            { label: agency.name[locale] },
          ]}
        />

        {/* Profile header */}
        <header className="mt-4 overflow-hidden rounded-xl border border-sand-200 bg-white">
          <div
            className="h-24 bg-lapis-900 sm:h-32"
            style={{
              backgroundImage:
                'linear-gradient(rgb(255 255 255 / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.07) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.07) 1px, transparent 1px)',
              backgroundSize: '100% 22px, 44px 44px, 44px 44px',
              backgroundPosition: '0 0, 0 0, 22px 22px',
            }}
          />
          <div className="flex flex-col gap-4 px-5 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <AgencyLogo
                initial={agency.initial[locale]}
                color={agency.color}
                className="-mt-10 size-20 border-4 border-white text-3xl shadow-raised sm:-mt-12 sm:size-24"
              />
              <div>
                <h1 className="text-2xl font-bold">{agency.name[locale]}</h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-sand-500">
                  {agency.verified && (
                    <Badge tone="verified">
                      <BadgeCheck aria-hidden />
                      {t('verifiedAgency')}
                    </Badge>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="size-3.5" aria-hidden />
                    {agency.city[locale]}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="size-3.5" aria-hidden />
                    {t('established', { year: agency.established })}
                  </span>
                </div>
              </div>
            </div>
            <ShareButton title={agency.name[locale]} url={pageUrl} />
          </div>
          <dl className="grid grid-cols-2 border-t border-sand-100 sm:grid-cols-4">
            {(
              [
                ['listings', stats.total],
                ['sale', stats.sale],
                ['rent', stats.rent],
                ['agents', agency.agents.length],
              ] as const
            ).map(([key, value], i) => (
              <div
                key={key}
                className={cn(
                  'px-5 py-4',
                  i > 0 && 'sm:border-s sm:border-sand-100',
                  i % 2 === 1 && 'border-s border-sand-100',
                )}
              >
                <dt className="text-xs text-sand-500">{t(`stats.${key}`)}</dt>
                <dd className="text-xl font-bold text-sand-900">
                  <bdi>{value}</bdi>
                </dd>
              </div>
            ))}
          </dl>
        </header>

        {/* Phones: contact right under the header instead of after all listings. */}
        <ContactButtons
          phone={agency.phone}
          message={t('whatsappMessage', { url: pageUrl })}
          size="sm"
          className="mt-4 lg:hidden"
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            <section aria-labelledby="about">
              <h2 id="about" className="text-xl font-semibold">
                {t('about')}
              </h2>
              <p className="mt-3 max-w-[70ch] text-sand-700">{agency.about[locale]}</p>
            </section>

            <section aria-labelledby="listings" className="mt-10">
              <h2 id="listings" className="text-xl font-semibold">
                {t('listingsTitle')}
              </h2>
              <nav
                className="mt-4 flex gap-2 border-b border-sand-200"
                aria-label={t('listingsTitle')}
              >
                {(['sale', 'rent'] as const).map((value) => (
                  <Link
                    key={value}
                    href={tabHref(value)}
                    scroll={false}
                    aria-current={tab === value ? 'page' : undefined}
                    className={cn(
                      '-mb-px border-b-2 px-3 pb-2.5 text-sm font-semibold transition-colors',
                      tab === value
                        ? 'border-lapis-600 text-lapis-700'
                        : 'border-transparent text-sand-500 hover:text-sand-900',
                    )}
                  >
                    {value === 'sale'
                      ? t('tabSale', { count: stats.sale })
                      : t('tabRent', { count: stats.rent })}
                  </Link>
                ))}
              </nav>
              {listings.total === 0 ? (
                <p className="mt-6 rounded-lg border border-dashed border-sand-300 bg-white p-8 text-center text-sm text-sand-500">
                  {t('noListings')}
                </p>
              ) : (
                <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {listings.items.map((listing) => (
                    <PropertyCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
              <Pagination
                page={listings.page}
                pageCount={listings.pageCount}
                hrefFor={(page) => tabHref(tab, page)}
              />
            </section>

            <section aria-labelledby="team" className="mt-10">
              <h2 id="team" className="text-xl font-semibold">
                {t('teamTitle')}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {agency.agents.map((agent) => (
                  <AgentCard
                    key={agent.slug}
                    agent={agent}
                    listingCount={stats.byAgent.get(agent.slug) ?? 0}
                    pageUrl={pageUrl}
                  />
                ))}
              </div>
            </section>
          </div>

          <aside className="lg:order-none">
            <div className="grid gap-4 lg:sticky lg:top-20">
              <div className="hidden rounded-xl border border-sand-200 bg-white p-5 shadow-card lg:block">
                <h2 className="text-base font-semibold">{t('contactTitle')}</h2>
                <ContactButtons
                  phone={agency.phone}
                  message={t('whatsappMessage', { url: pageUrl })}
                  className="mt-4"
                />
              </div>
              <div className="rounded-xl border border-sand-200 bg-white p-5">
                <h2 className="text-base font-semibold">{t('officeTitle')}</h2>
                <dl className="mt-3 grid gap-3 text-sm">
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-sand-500" aria-hidden />
                    <div>
                      <dt className="sr-only">{t('address')}</dt>
                      <dd className="text-sand-900">{agency.office.address[locale]}</dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="mt-0.5 size-4 shrink-0 text-sand-500" aria-hidden />
                    <div>
                      <dt className="sr-only">{t('hours')}</dt>
                      <dd className="text-sand-900">{agency.hours[locale]}</dd>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Languages className="mt-0.5 size-4 shrink-0 text-sand-500" aria-hidden />
                    <div>
                      <dt className="sr-only">{t('languages')}</dt>
                      <dd className="text-sand-900">
                        {agency.languages.map((l) => t(`languageNames.${l}`)).join(sep)}
                      </dd>
                    </div>
                  </div>
                </dl>
                <div className="mt-4">
                  <AreaMapLoader lat={agency.office.lat} lng={agency.office.lng} radius={150} />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
