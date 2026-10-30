'use client';

import { Button } from '@mahalla/ui';
import { useTranslations } from 'next-intl';
import { useFavourites, useRecentlyViewed } from '@/lib/use-favourites';
import { ListingIdGrid } from './saved-listings';

export function FavouritesPage() {
  const t = useTranslations('account');
  const { ids } = useFavourites();
  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">{t('favouritesTitle')}</h1>
      <ListingIdGrid ids={ids} emptyText={t('favouritesEmpty')} />
    </div>
  );
}

export function RecentPage() {
  const t = useTranslations('account');
  const { ids, clear } = useRecentlyViewed();
  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t('recentTitle')}</h1>
        {ids.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clear}>
            {t('clearRecent')}
          </Button>
        )}
      </div>
      <ListingIdGrid ids={ids} emptyText={t('recentEmpty')} />
    </div>
  );
}
