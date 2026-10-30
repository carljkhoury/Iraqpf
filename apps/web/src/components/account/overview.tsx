'use client';

import { Button } from '@mahalla/ui';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useDemoSession } from '@/lib/demo-session';
import { type MyListing, totals } from '@/lib/my-listings';
import { useFavourites } from '@/lib/use-favourites';
import { ListingsManager } from './listings-manager';
import { ListingIdGrid } from './saved-listings';
import { StatTile } from './status-badge';

export function AccountOverview({ myListings }: { myListings: MyListing[] }) {
  const t = useTranslations('account');
  const { user } = useDemoSession();
  const { ids } = useFavourites();
  const sum = totals(myListings.flatMap((m) => m.stats));

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('greeting', { name: user?.name ?? '' })}</h1>
          <p className="mt-1 text-sm text-sand-500">{t('overviewSubtitle')}</p>
        </div>
        <Button asChild>
          <Link href="/list-property">
            <Plus className="size-4" aria-hidden />
            {t('listProperty')}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile
          label={t('tiles.live')}
          value={myListings.filter((m) => m.status === 'live').length}
        />
        <StatTile label={t('tiles.views')} value={sum.views.toLocaleString('en-US')} />
        <StatTile label={t('tiles.leads')} value={sum.phoneReveals + sum.whatsappClicks} />
        <StatTile label={t('tiles.saved')} value={ids.length} />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('yourListings')}</h2>
          <Link
            href="/account/listings"
            className="text-sm font-semibold text-lapis-600 hover:text-lapis-700"
          >
            {t('viewAll')}
          </Link>
        </div>
        <ListingsManager initial={myListings} compact />
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('savedTitle')}</h2>
          <Link
            href="/account/favourites"
            className="text-sm font-semibold text-lapis-600 hover:text-lapis-700"
          >
            {t('viewAll')}
          </Link>
        </div>
        <ListingIdGrid ids={ids} limit={3} emptyText={t('favouritesEmpty')} />
      </section>
    </div>
  );
}
