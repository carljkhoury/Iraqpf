import type { Locale } from '@mahalla/shared';
import { cn } from '@mahalla/ui';
import { Camera } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { type ListingCardData, photoUrl } from '@/lib/sample-data';
import { FavouriteButton } from './favourite-button';
import { ListingImage } from './listing-image';
import {
  ListingAdvertiser,
  ListingBadges,
  ListingFacts,
  ListingLocation,
  ListingPrice,
  listingHref,
  useListingLabels,
} from './listing-parts';

export function PhotoCount({ count }: { count: number }) {
  const t = useTranslations('listing');
  return (
    <span className="absolute end-2.5 bottom-2.5 inline-flex items-center gap-1 rounded-sm bg-lapis-900/75 px-2 py-0.5 text-xs text-white">
      <Camera className="size-3.5" aria-hidden />
      <span className="sr-only">{t('photos')}</span>
      <bdi className="tabular">{count}</bdi>
    </span>
  );
}

export function PropertyCard({
  listing,
  priority = false,
}: {
  listing: ListingCardData;
  priority?: boolean;
}) {
  const locale = useLocale() as Locale;
  const { typeLine, detail } = useListingLabels(listing);

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg border shadow-card transition-shadow hover:shadow-raised',
        listing.featured ? 'border-gold-200 bg-gold-50' : 'border-sand-200 bg-white',
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-100">
        <ListingImage
          src={photoUrl(listing.photos[0]!, 800)}
          fallback={listing.fallbackImage}
          alt={listing.title[locale]}
          priority={priority}
          className="transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute start-2.5 top-2.5 flex gap-1.5">
          <ListingBadges listing={listing} />
        </div>
        <FavouriteButton listingId={listing.id} className="absolute end-2.5 top-2.5 z-10" />
        <PhotoCount count={listing.photos.length} />
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <ListingPrice listing={listing} />
        <h3 className="text-sm font-normal text-sand-700">
          <Link
            href={listingHref(listing)}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {typeLine}
          </Link>
          {detail && <span className="text-sand-500"> · {detail}</span>}
        </h3>
        <div className="mt-1">
          <ListingFacts listing={listing} />
        </div>
        <div className="mt-0.5">
          <ListingLocation listing={listing} />
        </div>
      </div>

      <ListingAdvertiser
        listing={listing}
        className={cn(
          'border-t px-3.5 py-2.5',
          listing.featured ? 'border-gold-200' : 'border-sand-100',
        )}
      />
    </article>
  );
}
