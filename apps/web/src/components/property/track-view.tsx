'use client';

import { useEffect } from 'react';
import { useRecentlyViewed } from '@/lib/use-favourites';

/** Adds the listing to "Recently viewed". View counting for advertisers comes with the API. */
export function TrackView({ listingId }: { listingId: number }) {
  const { record } = useRecentlyViewed();
  useEffect(() => record(listingId), [listingId, record]);
  return null;
}
