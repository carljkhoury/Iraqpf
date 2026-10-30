import {
  formatAreaParts,
  formatPriceParts,
  formatRelativeTime,
  type Locale,
} from '@mahalla/shared';
import { Badge, DisplayValue, cn } from '@mahalla/ui';
import { BadgeCheck, Bath, BedDouble, MapPin, Scan, Star } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { ListingCardData } from '@/lib/sample-data';

/** Pieces shared by the grid card and the list row, so both stay consistent. */

export function listingHref(listing: ListingCardData): string {
  return `/property/${listing.id}-${listing.slug}`;
}

export function useListingLabels(listing: ListingCardData) {
  const t = useTranslations('listing');
  const tc = useTranslations('catalog');
  const category = tc(`categories.${listing.category}`);
  const typeLine = t('typeLine', { category, purpose: t(`purpose.${listing.purpose}`) });
  const detail = listing.deed
    ? tc(`deed.${listing.deed}`)
    : listing.furnishing
      ? tc(`furnishing.${listing.furnishing}`)
      : null;
  return { typeLine, detail };
}

export function ListingPrice({
  listing,
  className,
}: {
  listing: ListingCardData;
  className?: string;
}) {
  const t = useTranslations('listing');
  const locale = useLocale() as Locale;
  const period =
    listing.rentPeriod === 'monthly'
      ? t('perMonth')
      : listing.rentPeriod === 'yearly'
        ? t('perYear')
        : null;
  return (
    <p className={cn('text-[21px] leading-tight font-bold text-sand-900', className)}>
      <DisplayValue {...formatPriceParts(listing.price, locale)} />
      {period && <span className="ms-1 text-[13px] font-medium text-sand-500">{period}</span>}
    </p>
  );
}

export function ListingFacts({ listing }: { listing: ListingCardData }) {
  const t = useTranslations('listing');
  const locale = useLocale() as Locale;
  return (
    <ul className="flex flex-wrap gap-x-3.5 gap-y-1 text-[13px] text-sand-700">
      {listing.bedrooms !== undefined && (
        <li className="inline-flex items-center gap-1.5">
          <BedDouble className="size-4 text-sand-500" aria-hidden />
          {t('beds', { count: listing.bedrooms })}
        </li>
      )}
      {listing.bathrooms !== undefined && (
        <li className="inline-flex items-center gap-1.5">
          <Bath className="size-4 text-sand-500" aria-hidden />
          {t('baths', { count: listing.bathrooms })}
        </li>
      )}
      <li className="inline-flex items-center gap-1.5">
        <Scan className="size-4 text-sand-500" aria-hidden />
        <DisplayValue {...formatAreaParts(listing.areaM2, locale, listing.areaUnit)} />
      </li>
    </ul>
  );
}

export function ListingLocation({ listing }: { listing: ListingCardData }) {
  const locale = useLocale() as Locale;
  return (
    <p className="inline-flex items-center gap-1 text-[13px] text-sand-500">
      <MapPin className="size-3.5 shrink-0" aria-hidden />
      {listing.location.name[locale]}
      {locale === 'ar' ? '، ' : ', '}
      {listing.location.city[locale]}
    </p>
  );
}

export function ListingBadges({ listing }: { listing: ListingCardData }) {
  const t = useTranslations('listing');
  return (
    <>
      {listing.featured && (
        <Badge tone="featured">
          <Star className="fill-current" aria-hidden />
          {t('featured')}
        </Badge>
      )}
      {listing.verified && (
        <Badge tone="verified">
          <BadgeCheck aria-hidden />
          {t('verified')}
        </Badge>
      )}
    </>
  );
}

export function ListingAdvertiser({
  listing,
  className,
}: {
  listing: ListingCardData;
  className?: string;
}) {
  const locale = useLocale() as Locale;
  return (
    <div className={cn('flex items-center justify-between gap-2 text-xs text-sand-500', className)}>
      <span className="flex min-w-0 items-center gap-2">
        <span
          aria-hidden
          className="grid size-6 shrink-0 place-items-center rounded-sm bg-lapis-100 text-[11px] font-bold text-lapis-700"
        >
          {listing.advertiser.initial[locale]}
        </span>
        <span className="truncate font-medium text-sand-700">
          {listing.advertiser.name[locale]}
        </span>
      </span>
      <time dateTime={listing.postedAt} className="shrink-0">
        {formatRelativeTime(new Date(listing.postedAt), locale)}
      </time>
    </div>
  );
}
