'use client';

import { useCallback, useEffect, useState } from 'react';
import type { ListingStatus, MyListing } from '@/lib/my-listings';

/**
 * Applies the demo user's actions (pause, renew, delete…) on top of the sample
 * listings, saved in this browser. In Phase 3 each action is an API call that
 * goes through the listing lifecycle service (docs/05-database.md §7).
 */
const KEY = 'mahalla:demo-my-listings';
type Override = { status?: ListingStatus | 'deleted'; expiresAt?: string };

export type ListingAction = 'pause' | 'resume' | 'renew' | 'markSold' | 'delete' | 'submit';

export function useMyListings(initial: MyListing[]) {
  const [overrides, setOverrides] = useState<Record<number, Override>>({});

  useEffect(() => {
    try {
      setOverrides(JSON.parse(window.localStorage.getItem(KEY) ?? '{}'));
    } catch {
      // Fall back to the original sample statuses.
    }
  }, []);

  const apply = useCallback((id: number, action: ListingAction) => {
    const change: Override =
      action === 'pause'
        ? { status: 'paused' }
        : action === 'resume'
          ? { status: 'live' }
          : action === 'renew'
            ? { status: 'live', expiresAt: new Date(Date.now() + 60 * 86_400_000).toISOString() }
            : action === 'markSold'
              ? { status: 'sold_rented' }
              : action === 'submit'
                ? { status: 'pending_review' }
                : { status: 'deleted' };
    setOverrides((prev) => {
      const next = { ...prev, [id]: { ...prev[id], ...change } };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        // Not persisted in private mode.
      }
      return next;
    });
  }, []);

  const listings: MyListing[] = initial.flatMap((m) => {
    const o = overrides[m.listing.id];
    if (o?.status === 'deleted') return [];
    return [{ ...m, status: o?.status ?? m.status, expiresAt: o?.expiresAt ?? m.expiresAt }];
  });

  return { listings, apply };
}
