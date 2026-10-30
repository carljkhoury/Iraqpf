import type { Locale } from '@mahalla/shared';
import { cn } from '@mahalla/ui';
import { useLocale } from 'next-intl';
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
import { PhotoCount } from './property-card';

/** List-view variant: photo on the start side, details on the end side. */
export function ListingRow({
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
        'group relative grid overflow-hidden rounded-lg border shadow-card transition-shadow hover:shadow-raised sm:grid-cols-[minmax(0,300px)_minmax(0,1fr)]',
        listing.featured ? 'border-gold-200 bg-gold-50' : 'border-sand-200 bg-white',
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-100 sm:aspect-auto sm:min-h-[220px]">
        <ListingImage
          src={photoUrl(listing.photos[0]!, 800)}
          fallback={listing.fallbackImage}
          alt={listing.title[locale]}
          priority={priority}
        />
        <div className="absolute start-2.5 top-2.5 flex gap-1.5">
          <ListingBadges listing={listing} />
        </div>
        <PhotoCount count={listing.photos.length} />
      </div>

      <div className="flex min-w-0 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <ListingPrice listing={listing} className="text-[22px]" />
          <FavouriteButton
            listingId={listing.id}
            className="relative z-10 shrink-0 border border-sand-200"
          />
        </div>
        <h3 className="text-base font-semibold text-sand-900">
          <Link
            href={listingHref(listing)}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {listing.title[locale]}
          </Link>
        </h3>
        <p className="text-sm text-sand-700">
          {typeLine}
          {detail && <span className="text-sand-500"> · {detail}</span>}
        </p>
        <ListingFacts listing={listing} />
        <ListingLocation listing={listing} />
        <p className="line-clamp-2 text-sm text-sand-500">{listing.description[locale]}</p>
        <ListingAdvertiser listing={listing} className="mt-auto pt-2" />
      </div>
    </article>
  );
}
