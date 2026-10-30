import {
  formatAreaParts,
  formatDate,
  formatNumber,
  formatPriceParts,
  type Locale,
} from '@mahalla/shared';
import { DisplayValue } from '@mahalla/ui';
import {
  AirVent,
  ArrowUpDown,
  Bath,
  BedDouble,
  Car,
  CookingPot,
  Droplets,
  LandPlot,
  MapPin,
  PlugZap,
  Route,
  Scan,
  ShieldCheck,
  SquareParking,
  Sun,
  Trees,
  Zap,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { searchPath } from '@/lib/catalog';
import type { AmenityKey, ListingCardData } from '@/lib/sample-data';

const AMENITY_ICON: Record<AmenityKey, typeof Zap> = {
  generator: Zap,
  dedicated_power: PlugZap,
  water_tank: Droplets,
  garage: Car,
  garden: Trees,
  fitted_kitchen: CookingPot,
  central_ac: AirVent,
  solar: Sun,
  elevator: ArrowUpDown,
  security: ShieldCheck,
  parking: SquareParking,
  main_road: Route,
};

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-sand-200 py-7">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      {children}
    </section>
  );
}

/** Large icons for the facts buyers scan first. */
export function KeyFacts({ listing }: { listing: ListingCardData }) {
  const t = useTranslations('property.details');
  const tl = useTranslations('listing');
  const locale = useLocale() as Locale;
  const facts: { icon: typeof Zap; label: string; value: ReactNode }[] = [];
  if (listing.bedrooms !== undefined)
    facts.push({
      icon: BedDouble,
      label: t('bedrooms'),
      value: tl('beds', { count: listing.bedrooms }),
    });
  if (listing.bathrooms !== undefined)
    facts.push({
      icon: Bath,
      label: t('bathrooms'),
      value: tl('baths', { count: listing.bathrooms }),
    });
  facts.push({
    icon: Scan,
    label: t('area'),
    value: <DisplayValue {...formatAreaParts(listing.areaM2, locale, listing.areaUnit)} />,
  });
  if (listing.plotM2)
    facts.push({
      icon: LandPlot,
      label: t('plotArea'),
      value: <DisplayValue {...formatAreaParts(listing.plotM2, locale)} />,
    });

  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {facts.map(({ icon: Icon, label, value }) => (
        <li key={label} className="rounded-lg border border-sand-200 bg-white p-3.5">
          <Icon className="size-5 text-lapis-600" aria-hidden />
          <p className="mt-2 text-xs text-sand-500">{label}</p>
          <p className="font-semibold text-sand-900">{value}</p>
        </li>
      ))}
    </ul>
  );
}

export function DetailsTable({ listing }: { listing: ListingCardData }) {
  const t = useTranslations('property.details');
  const tl = useTranslations('listing');
  const tc = useTranslations('catalog');
  const locale = useLocale() as Locale;

  const rows: [string, ReactNode][] = [
    [t('type'), tc(`categories.${listing.category}`)],
    [t('purpose'), tl(`purpose.${listing.purpose}`)],
    [t('price'), <DisplayValue key="p" {...formatPriceParts(listing.price, locale)} />],
  ];
  if (listing.purpose === 'sale' && listing.areaUnit === 'm2') {
    const perM2 = Math.round(listing.price.amount / listing.areaM2);
    rows.push([
      t('pricePerM2'),
      <DisplayValue key="ppm" {...formatPriceParts({ ...listing.price, amount: perM2 }, locale)} />,
    ]);
  }
  if (listing.rentPeriod) rows.push([t('rentPeriod'), t(listing.rentPeriod)]);
  rows.push([
    t('area'),
    <DisplayValue key="a" {...formatAreaParts(listing.areaM2, locale, listing.areaUnit)} />,
  ]);
  if (listing.plotM2)
    rows.push([
      t('plotArea'),
      <DisplayValue key="pa" {...formatAreaParts(listing.plotM2, locale)} />,
    ]);
  if (listing.bedrooms !== undefined)
    rows.push([t('bedrooms'), tl('beds', { count: listing.bedrooms })]);
  if (listing.bathrooms !== undefined)
    rows.push([t('bathrooms'), tl('baths', { count: listing.bathrooms })]);
  if (listing.floor !== undefined)
    rows.push([
      t('floor'),
      listing.floor === 0 ? (
        t('floorGround')
      ) : (
        <bdi key="f">{formatNumber(listing.floor, locale)}</bdi>
      ),
    ]);
  if (listing.furnishing) rows.push([t('furnishing'), tc(`furnishing.${listing.furnishing}`)]);
  if (listing.deed) rows.push([t('deed'), tc(`deed.${listing.deed}`)]);
  rows.push([
    t('reference'),
    <bdi key="r" className="tabular">
      {listing.id}
    </bdi>,
  ]);
  rows.push([t('listed'), formatDate(new Date(listing.postedAt), locale)]);

  return (
    <dl className="grid gap-x-8 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div
          key={label}
          className="flex items-center justify-between gap-4 border-b border-sand-100 py-3 text-sm"
        >
          <dt className="text-sand-500">{label}</dt>
          <dd className="text-end font-medium text-sand-900">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function AmenitiesList({ amenities }: { amenities: AmenityKey[] }) {
  const t = useTranslations('catalog.amenities');
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
      {amenities.map((key) => {
        const Icon = AMENITY_ICON[key];
        return (
          <li key={key} className="flex items-center gap-3 text-sm text-sand-900">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-lapis-50 text-lapis-600">
              <Icon className="size-4" aria-hidden />
            </span>
            {t(key)}
          </li>
        );
      })}
    </ul>
  );
}

export function LocationCard({ listing }: { listing: ListingCardData }) {
  const t = useTranslations('property');
  const locale = useLocale() as Locale;
  const purpose = listing.purpose === 'sale' ? 'buy' : 'rent';
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-sand-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-lapis-50 text-lapis-600">
          <MapPin className="size-5" aria-hidden />
        </span>
        <div>
          <p className="font-semibold text-sand-900">
            {listing.location.name[locale]}
            {locale === 'ar' ? '، ' : ', '}
            {listing.location.city[locale]}
          </p>
          <p className="mt-0.5 max-w-md text-sm text-sand-500">{t('locationApprox')}</p>
        </div>
      </div>
      <Link
        href={searchPath(purpose, 'properties', listing.locationPath)}
        className="text-sm font-semibold text-lapis-600 hover:text-lapis-700"
      >
        {t('moreInArea', { area: listing.location.name[locale] })}
      </Link>
    </div>
  );
}
