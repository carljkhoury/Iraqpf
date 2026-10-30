import type { Locale } from '@mahalla/shared';
import { formatPrice } from '@mahalla/shared';
import { Container } from '@mahalla/ui';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FavouriteButton } from '@/components/favourite-button';
import {
  ListingBadges,
  ListingLocation,
  ListingPrice,
  listingHref,
} from '@/components/listing-parts';
import { PropertyCard } from '@/components/property-card';
import { ContactCard, MobileContactBar } from '@/components/property/contact';
import { Gallery } from '@/components/property/gallery';
import {
  AmenitiesList,
  DetailsTable,
  KeyFacts,
  LocationCard,
  Section,
} from '@/components/property/listing-details';
import { ReportDialog } from '@/components/property/report-dialog';
import { ShareButton } from '@/components/property/share-button';
import { Breadcrumbs } from '@/components/search/breadcrumbs';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { searchPath } from '@/lib/catalog';
import { getListing, similarListings } from '@/lib/listings-repo';
import { SAMPLE_LISTINGS, photoUrl } from '@/lib/sample-data';
import { SITE_URL, alternates } from '@/lib/seo';

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    SAMPLE_LISTINGS.map((l) => ({ locale, slug: `${l.id}-${l.slug}` })),
  );
}

function load(slug: string) {
  const id = Number.parseInt(slug, 10);
  const listing = Number.isFinite(id) ? getListing(id) : undefined;
  if (!listing) notFound();
  return listing;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const listing = load(slug);
  const title = `${listing.title[locale]} · ${formatPrice(listing.price, locale)}`;
  return {
    title,
    description: listing.description[locale].slice(0, 160),
    alternates: alternates(locale, listingHref(listing)),
    openGraph: { title, images: [photoUrl(listing.photos[0]!, 1200)] },
  };
}

export default async function PropertyPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const listing = load(slug);

  // Old or edited titles still work: redirect to the current URL (the ID is permanent).
  const canonical = listingHref(listing);
  if (slug !== canonical.split('/').pop())
    permanentRedirect(getPathname({ href: canonical, locale }));

  const t = await getTranslations('property');
  const tn = await getTranslations('nav');
  const tc = await getTranslations('catalog');
  const ts = await getTranslations('search');
  const pageUrl = `${SITE_URL}${getPathname({ href: canonical, locale })}`;
  const purpose = listing.purpose === 'sale' ? 'buy' : 'rent';
  const governorate = listing.locationPath.split('/')[0]!;
  const similar = similarListings(listing, 4);
  const lang = locale;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: listing.title[locale],
    description: listing.description[locale],
    url: pageUrl,
    image: listing.photos.map((id) => photoUrl(id, 1200)),
    datePosted: listing.postedAt,
    offers: {
      '@type': 'Offer',
      price: listing.price.amount,
      priceCurrency: listing.price.currency,
      businessFunction:
        listing.purpose === 'sale'
          ? 'http://purl.org/goodrelations/v1#Sell'
          : 'http://purl.org/goodrelations/v1#LeaseOut',
    },
    contentLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: listing.location.name[locale],
        addressRegion: listing.location.city[locale],
        addressCountry: 'IQ',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="pt-4 pb-28 sm:pt-6 lg:pb-12">
        <Breadcrumbs
          items={[
            { label: ts('home'), href: '/' },
            { label: tn(purpose), href: searchPath(purpose, 'properties') },
            {
              label: tc(`plural.${listing.category}`),
              href: searchPath(purpose, listing.category),
            },
            {
              label: listing.location.city[locale],
              href: searchPath(purpose, listing.category, governorate),
            },
            {
              label: listing.location.name[locale],
              href: searchPath(purpose, listing.category, listing.locationPath),
            },
          ]}
        />

        <div className="mt-4">
          <Gallery
            photos={listing.photos}
            fallback={listing.fallbackImage}
            alt={listing.title[locale]}
          />
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <header className="pb-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-1.5">
                  <ListingBadges listing={listing} />
                </div>
                <div className="flex items-center gap-2">
                  <ShareButton title={listing.title[locale]} url={pageUrl} />
                  <FavouriteButton
                    listingId={listing.id}
                    className="size-9 border border-sand-200"
                  />
                </div>
              </div>
              <ListingPrice listing={listing} className="mt-3 text-3xl" />
              <h1 className="mt-2 text-xl font-semibold sm:text-2xl">{listing.title[locale]}</h1>
              <div className="mt-2">
                <ListingLocation listing={listing} />
              </div>
            </header>

            <KeyFacts listing={listing} />

            <Section title={t('description')}>
              <p lang={lang} className="max-w-[70ch] whitespace-pre-line text-sand-700">
                {listing.description[locale]}
              </p>
            </Section>

            <Section title={t('detailsTitle')}>
              <DetailsTable listing={listing} />
            </Section>

            {listing.amenities.length > 0 && (
              <Section title={t('amenitiesTitle')}>
                <AmenitiesList amenities={listing.amenities} />
              </Section>
            )}

            <Section title={t('locationTitle')}>
              <LocationCard listing={listing} />
            </Section>

            <div className="pb-7 lg:hidden">
              <ContactCard listing={listing} pageUrl={pageUrl} />
            </div>

            <div className="border-t border-sand-200 pt-5">
              <ReportDialog />
            </div>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-20">
              <ContactCard listing={listing} pageUrl={pageUrl} />
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section aria-labelledby="similar" className="mt-10 border-t border-sand-200 pt-8">
            <h2 id="similar" className="mb-5 text-xl font-semibold sm:text-2xl">
              {t('similarTitle')}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {similar.map((l) => (
                <PropertyCard key={l.id} listing={l} />
              ))}
            </div>
          </section>
        )}
      </Container>
      <MobileContactBar listing={listing} pageUrl={pageUrl} />
    </>
  );
}
