'use client';

import { formatPrice, type Locale } from '@mahalla/shared';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { type ListingCardData, photoUrl } from '@/lib/sample-data';
import { FavouriteButton } from '../favourite-button';
import { ListingImage } from '../listing-image';
import {
  ListingFacts,
  ListingLocation,
  ListingPrice,
  listingHref,
  useListingLabels,
} from '../listing-parts';
import type { MapPoint } from './listings-map';

// MapLibre needs the browser; load it only for the map view.
const ListingsMap = dynamic(() => import('./listings-map').then((m) => m.ListingsMap), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse rounded-lg bg-lapis-50" />,
});

function PreviewCard({ listing, onClose }: { listing: ListingCardData; onClose: () => void }) {
  const t = useTranslations('map');
  const locale = useLocale() as Locale;
  const { typeLine } = useListingLabels(listing);
  return (
    <article className="relative grid grid-cols-[112px_minmax(0,1fr)] overflow-hidden rounded-lg bg-white shadow-overlay sm:grid-cols-[150px_minmax(0,1fr)]">
      <div className="relative min-h-28 bg-sand-100">
        <ListingImage
          src={photoUrl(listing.photos[0]!, 400)}
          fallback={listing.fallbackImage}
          alt={listing.title[locale]}
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1 p-3 pe-10">
        <ListingPrice listing={listing} className="text-lg" />
        <h3 className="truncate text-sm font-semibold text-sand-900">
          <Link
            href={listingHref(listing)}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {listing.title[locale]}
          </Link>
        </h3>
        <p className="truncate text-xs text-sand-500">{typeLine}</p>
        <div className="hidden sm:block">
          <ListingFacts listing={listing} />
        </div>
        <ListingLocation listing={listing} />
      </div>
      <div className="absolute end-2 top-2 z-10 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={onClose}
          aria-label={t('closePreview')}
          className="grid size-8 place-items-center rounded-full bg-sand-100 text-sand-700 hover:bg-sand-200"
        >
          <X className="size-4" aria-hidden />
        </button>
        <FavouriteButton listingId={listing.id} className="size-8 border border-sand-200" />
      </div>
    </article>
  );
}

export function SearchMapView({
  listings,
  fallbackCenter,
  fallbackZoom,
}: {
  listings: ListingCardData[];
  fallbackCenter?: [number, number];
  fallbackZoom?: number;
}) {
  const t = useTranslations('map');
  const locale = useLocale() as Locale;
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = listings.find((l) => l.id === selectedId) ?? null;

  const points = useMemo<MapPoint[]>(
    () =>
      listings.map((l) => ({
        id: l.id,
        lat: l.point.lat,
        lng: l.point.lng,
        label: formatPrice(l.price, locale, { compact: true }),
        featured: l.featured,
      })),
    [listings, locale],
  );

  return (
    <div>
      <div className="relative h-[calc(100dvh-260px)] min-h-[420px]">
        <ListingsMap
          points={points}
          selectedId={selectedId}
          onSelect={setSelectedId}
          fallbackCenter={fallbackCenter}
          fallbackZoom={fallbackZoom}
          className="size-full"
        />
        {selected && (
          <div className="absolute inset-x-3 bottom-3 z-10 mx-auto max-w-lg">
            <PreviewCard listing={selected} onClose={() => setSelectedId(null)} />
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-sand-500">{t('approxNote')}</p>
    </div>
  );
}
