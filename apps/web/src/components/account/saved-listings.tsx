'use client';

import { Button } from '@mahalla/ui';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import type { ListingCardData } from '@/lib/sample-data';
import { PropertyCard } from '../property-card';

/** Loads card data for a list of IDs (favourites, recently viewed), keeping their order. */
export function ListingIdGrid({
  ids,
  emptyText,
  limit,
}: {
  ids: number[];
  emptyText: string;
  limit?: number;
}) {
  const t = useTranslations('account');
  const [items, setItems] = useState<ListingCardData[] | null>(null);
  const shown = limit ? ids.slice(0, limit) : ids;
  const key = shown.join(',');

  useEffect(() => {
    if (!key) {
      setItems([]);
      return;
    }
    let cancelled = false;
    fetch(`/api/listings?ids=${key}`)
      .then((r) => r.json() as Promise<ListingCardData[]>)
      .then((data) => !cancelled && setItems(data))
      .catch(() => !cancelled && setItems([]));
    return () => {
      cancelled = true;
    };
  }, [key]);

  if (items === null) {
    return <div className="h-64 animate-pulse rounded-lg bg-sand-100" aria-busy="true" />;
  }
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-sand-300 bg-white p-8 text-center">
        <p className="text-sm text-sand-500">{emptyText}</p>
        <Button asChild variant="secondary" className="mt-4">
          <Link href="/buy/residential">{t('browse')}</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((listing) => (
        <PropertyCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
