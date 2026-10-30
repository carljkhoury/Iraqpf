'use client';

import { formatNumber, formatPriceParts, type Locale } from '@mahalla/shared';
import { Button, DisplayValue, cn } from '@mahalla/ui';
import * as Dialog from '@radix-ui/react-dialog';
import { BarChart3, Eye, Pause, Play, RefreshCw, CircleCheck, Send, Trash2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { type MyListing, totals } from '@/lib/my-listings';
import { photoUrl } from '@/lib/sample-data';
import { ListingImage } from '../listing-image';
import { listingHref } from '../listing-parts';
import { StatusBadge } from './status-badge';
import { type ListingAction, useMyListings } from './use-my-listings';

type Filter = 'all' | 'live' | 'pending_review' | 'draft' | 'expired' | 'other';
const FILTERS: Filter[] = ['all', 'live', 'pending_review', 'draft', 'expired', 'other'];

function matches(filter: Filter, status: MyListing['status']) {
  if (filter === 'all') return true;
  if (filter === 'other') return ['paused', 'rejected', 'sold_rented'].includes(status);
  return status === filter;
}

function actionsFor(status: MyListing['status']): ListingAction[] {
  switch (status) {
    case 'live':
      return ['pause', 'markSold'];
    case 'paused':
      return ['resume', 'markSold'];
    case 'expired':
      return ['renew'];
    case 'draft':
    case 'rejected':
      return ['submit'];
    default:
      return [];
  }
}

const ACTION_ICON = {
  pause: Pause,
  resume: Play,
  renew: RefreshCw,
  markSold: CircleCheck,
  submit: Send,
  delete: Trash2,
};

export function ListingsManager({
  initial,
  compact = false,
}: {
  initial: MyListing[];
  compact?: boolean;
}) {
  const t = useTranslations('account');
  const locale = useLocale() as Locale;
  const { listings, apply } = useMyListings(initial);
  const [filter, setFilter] = useState<Filter>('all');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const run = (id: number, action: ListingAction) => {
    apply(id, action);
    setMessage(t(`done.${action}`));
  };

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(''), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  const shown = (compact ? listings.slice(0, 3) : listings).filter((m) =>
    matches(filter, m.status),
  );
  const daysLeft = (iso?: string) =>
    iso ? Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000) : null;

  return (
    <div>
      {!compact && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]" role="group">
          {FILTERS.map((f) => {
            const count = listings.filter((m) => matches(f, m.status)).length;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={cn(
                  'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm transition-colors',
                  filter === f
                    ? 'border-lapis-600 bg-lapis-600 text-white'
                    : 'border-sand-200 bg-white text-sand-700 hover:bg-lapis-50',
                )}
              >
                {t(`filters.${f}`)}
                <bdi className="text-xs opacity-80">{count}</bdi>
              </button>
            );
          })}
        </div>
      )}

      {/* Floating confirmation: never shifts the list under the user's finger. */}
      <p
        role="status"
        aria-live="polite"
        className={cn(
          'pointer-events-none fixed inset-x-4 bottom-4 z-40 mx-auto max-w-sm rounded-md bg-sand-900 px-4 py-3 text-center text-sm text-white shadow-overlay transition-opacity',
          message ? 'opacity-100' : 'opacity-0',
        )}
      >
        {message}
      </p>

      {shown.length === 0 ? (
        <p className="rounded-lg border border-dashed border-sand-300 bg-white p-8 text-center text-sm text-sand-500">
          {listings.length === 0 ? t('noListingsYet') : t('emptyListings')}
        </p>
      ) : (
        <ul className="grid gap-3">
          {shown.map((m) => {
            const { listing } = m;
            const sum = totals(m.stats);
            const left = daysLeft(m.expiresAt);
            return (
              <li
                key={listing.id}
                className="rounded-lg border border-sand-200 bg-white p-3 sm:p-4"
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-md bg-sand-100 sm:h-24 sm:w-32">
                    <ListingImage
                      src={photoUrl(listing.photos[0]!, 300)}
                      fallback={listing.fallbackImage}
                      alt=""
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={m.status} />
                      {m.status === 'live' && left !== null && (
                        <span
                          className={cn(
                            'text-xs',
                            left <= 7 ? 'text-warning-600' : 'text-sand-500',
                          )}
                        >
                          {t('expiresIn', { days: Math.max(0, left) })}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 truncate font-semibold text-sand-900">
                      {listing.title[locale]}
                    </h3>
                    <p className="text-sm font-semibold text-sand-700">
                      <DisplayValue {...formatPriceParts(listing.price, locale)} />
                    </p>
                    <p className="mt-1 flex flex-wrap gap-x-4 text-xs text-sand-500">
                      <span>
                        {t('columns.views')}:{' '}
                        <bdi className="tabular">{formatNumber(sum.views, locale)}</bdi>
                      </span>
                      <span>
                        {t('columns.leads')}:{' '}
                        <bdi className="tabular">{sum.phoneReveals + sum.whatsappClicks}</bdi>
                      </span>
                    </p>
                  </div>
                </div>
                {m.status === 'rejected' && m.rejectionReason && (
                  <p className="mt-3 rounded-md bg-danger-50 px-3 py-2 text-xs text-danger-600">
                    {t(`rejectedReason.${m.rejectionReason}`)}
                  </p>
                )}
                {!compact && (
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-sand-100 pt-3">
                    {m.status === 'live' && (
                      <Button asChild variant="ghost" size="sm">
                        <Link href={listingHref(listing)}>
                          <Eye className="size-4" aria-hidden />
                          {t('actions.view')}
                        </Link>
                      </Button>
                    )}
                    {sum.views > 0 && (
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/account/listings/${listing.id}`}>
                          <BarChart3 className="size-4" aria-hidden />
                          {t('actions.stats')}
                        </Link>
                      </Button>
                    )}
                    {actionsFor(m.status).map((action) => {
                      const Icon = ACTION_ICON[action];
                      return (
                        <Button
                          key={action}
                          variant="ghost"
                          size="sm"
                          onClick={() => run(listing.id, action)}
                        >
                          <Icon className="size-4" aria-hidden />
                          {t(`actions.${action}`)}
                        </Button>
                      );
                    })}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ms-auto text-danger-600 hover:bg-danger-50"
                      onClick={() => setConfirmDelete(listing.id)}
                    >
                      <Trash2 className="size-4" aria-hidden />
                      {t('actions.delete')}
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Dialog.Root
        open={confirmDelete !== null}
        onOpenChange={(open) => !open && setConfirmDelete(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-lapis-900/40" />
          <Dialog.Content className="fixed start-1/2 top-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-overlay rtl:translate-x-1/2">
            <Dialog.Title className="text-lg font-semibold">{t('deleteTitle')}</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-sand-700">
              {t('deleteText')}
            </Dialog.Description>
            <div className="mt-6 flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button variant="secondary">{t('cancel')}</Button>
              </Dialog.Close>
              <Button
                variant="danger"
                onClick={() => {
                  if (confirmDelete !== null) run(confirmDelete, 'delete');
                  setConfirmDelete(null);
                }}
              >
                {t('deleteConfirm')}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
