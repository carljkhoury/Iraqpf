'use client';

import { useCallback, useSyncExternalStore } from 'react';
import type { ListingStatus, MyListing } from '@/lib/my-listings';

/**
 * Applies the demo user's actions (pause, renew, delete…) on top of the sample
 * listings, saved in this browser. In Phase 3 each action is an API call that
 * goes through the listing lifecycle service (docs/05-database.md §7).
 */
const KEY = 'mahalla:demo-my-listings';
type Override = { status?: ListingStatus | 'deleted'; expiresAt?: string };
type Overrides = Record<number, Override>;

export type ListingAction = 'pause' | 'resume' | 'renew' | 'markSold' | 'delete' | 'submit';

const listeners = new Set<() => void>();
const EMPTY: Overrides = {};
let cache: Overrides | null = null;

function read(): Overrides {
  if (cache) return cache;
  try {
    cache = JSON.parse(window.localStorage.getItem(KEY) ?? '{}') as Overrides;
  } catch {
    cache = {};
  }
  return cache;
}

function write(next: Overrides) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Not persisted in private mode.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const CHANGES: Record<ListingAction, () => Override> = {
  pause: () => ({ status: 'paused' }),
  resume: () => ({ status: 'live' }),
  renew: () => ({
    status: 'live',
    expiresAt: new Date(Date.now() + 60 * 86_400_000).toISOString(),
  }),
  markSold: () => ({ status: 'sold_rented' }),
  submit: () => ({ status: 'pending_review' }),
  delete: () => ({ status: 'deleted' }),
};

export function useMyListings(initial: MyListing[]) {
  const overrides = useSyncExternalStore(subscribe, read, () => EMPTY);

  const apply = useCallback((id: number, action: ListingAction) => {
    const current = read();
    write({ ...current, [id]: { ...current[id], ...CHANGES[action]() } });
  }, []);

  const listings: MyListing[] = initial.flatMap((m) => {
    const o = overrides[m.listing.id];
    if (o?.status === 'deleted') return [];
    return [{ ...m, status: o?.status ?? m.status, expiresAt: o?.expiresAt ?? m.expiresAt }];
  });

  return { listings, apply };
}
