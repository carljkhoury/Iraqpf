import type { Locale } from '@mahalla/shared';
import { ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { StatTile, StatusBadge } from '@/components/account/status-badge';
import { ViewsChart } from '@/components/account/views-chart';
import { listingHref } from '@/components/listing-parts';
import { Link } from '@/i18n/navigation';
import { getMyListing, totals } from '@/lib/my-listings';

export default async function ListingStatsPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const mine = getMyListing(Number(id));
  if (!mine) notFound();
  const t = await getTranslations('account');
  const sum = totals(mine.stats);
  const contactRate = sum.views ? ((sum.phoneReveals + sum.whatsappClicks) / sum.views) * 100 : 0;

  return (
    <div className="grid gap-6">
      <Link
        href="/account/listings"
        className="inline-flex items-center gap-1 text-sm font-semibold text-lapis-600"
      >
        <ChevronRight className="size-4 ltr:-scale-x-100" aria-hidden />
        {t('backToListings')}
      </Link>
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold">{t('statsTitle')}</h1>
          <StatusBadge status={mine.status} />
        </div>
        <p className="mt-1 text-sm text-sand-500">
          <Link
            href={listingHref(mine.listing)}
            className="font-medium text-sand-700 hover:text-lapis-700"
          >
            {mine.listing.title[locale]}
          </Link>{' '}
          · {t('statsSubtitle')}
        </p>
      </div>
      {sum.views === 0 ? (
        <p className="rounded-lg border border-dashed border-sand-300 bg-white p-8 text-center text-sm text-sand-500">
          {t('noStatsYet')}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            <StatTile label={t('statTiles.views')} value={sum.views.toLocaleString('en-US')} />
            <StatTile label={t('statTiles.phoneReveals')} value={sum.phoneReveals} />
            <StatTile label={t('statTiles.whatsappClicks')} value={sum.whatsappClicks} />
            <StatTile label={t('statTiles.favourites')} value={mine.favourites} />
            <StatTile
              label={t('statTiles.contactRate')}
              value={`${contactRate.toFixed(1)}%`}
              help={t('contactRateHelp')}
            />
          </div>
          <ViewsChart stats={mine.stats} title={t('viewsPerDay')} />
        </>
      )}
    </div>
  );
}
