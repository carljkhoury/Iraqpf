import {
  formatAreaParts,
  formatPriceParts,
  formatRelativeTime,
  type Locale,
} from '@mahalla/shared';
import { Badge, DisplayValue, cn } from '@mahalla/ui';
import { BadgeCheck, Bath, BedDouble, Camera, MapPin, Scan, Star } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { ListingCardData } from '@/lib/sample-data';
import { FavouriteButton } from './favourite-button';

export function PropertyCard({
  listing,
  priority = false,
}: {
  listing: ListingCardData;
  priority?: boolean;
}) {
  const t = useTranslations('listing');
  const tc = useTranslations('catalog');
  const locale = useLocale() as Locale;

  const href = `/property/${listing.id}-${listing.slug}`;
  const category = tc(`categories.${listing.category}`);
  const typeLine = t('typeLine', { category, purpose: t(`purpose.${listing.purpose}`) });
  const detail = listing.deed
    ? tc(`deed.${listing.deed}`)
    : listing.furnishing
      ? tc(`furnishing.${listing.furnishing}`)
      : null;
  const period =
    listing.rentPeriod === 'monthly'
      ? t('perMonth')
      : listing.rentPeriod === 'yearly'
        ? t('perYear')
        : null;

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border shadow-card transition-shadow hover:shadow-raised',
        listing.featured ? 'border-gold-200 bg-gold-50' : 'border-sand-200 bg-white',
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-100">
        <Image
          src={listing.image}
          alt={`${typeLine} - ${listing.location.name[locale]}`}
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          priority={priority}
          unoptimized
        />
        <div className="absolute start-2.5 top-2.5 flex gap-1.5">
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
        </div>
        <FavouriteButton listingId={listing.id} className="absolute end-2.5 top-2.5 z-10" />
        <span className="absolute end-2.5 bottom-2.5 inline-flex items-center gap-1 rounded-sm bg-lapis-900/75 px-2 py-0.5 text-xs text-white">
          <Camera className="size-3.5" aria-hidden />
          <span className="sr-only">{t('photos')}</span>
          <bdi className="tabular">{listing.imageCount}</bdi>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <p className="text-[21px] leading-tight font-bold text-sand-900">
          <DisplayValue {...formatPriceParts(listing.price, locale)} />
          {period && <span className="ms-1 text-[13px] font-medium text-sand-500">{period}</span>}
        </p>
        <h3 className="text-sm font-normal text-sand-700">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {typeLine}
          </Link>
          {detail && <span className="text-sand-500"> · {detail}</span>}
        </h3>
        <ul className="mt-1 flex flex-wrap gap-x-3.5 gap-y-1 text-[13px] text-sand-700">
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
        <p className="mt-0.5 inline-flex items-center gap-1 text-[13px] text-sand-500">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          {listing.location.name[locale]}
          {locale === 'ar' ? '، ' : ', '}
          {listing.location.city[locale]}
        </p>
      </div>

      <div
        className={cn(
          'flex items-center justify-between gap-2 border-t px-3.5 py-2.5 text-xs text-sand-500',
          listing.featured ? 'border-gold-200' : 'border-sand-100',
        )}
      >
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
    </article>
  );
}
