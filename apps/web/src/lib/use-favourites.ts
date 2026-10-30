'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Favourites kept in the browser during Phase 2. In Phase 3 logged-in users'
 * favourites move to the API (`favourites` table) and this hook syncs with it.
 */
const KEY = 'mahalla:favourites';
const listeners = new Set<() => void>();
let cache: number[] | null = null;

function read(): number[] {
  if (cache) return cache;
  try {
    const parsed: unknown = JSON.parse(window.localStorage.getItem(KEY) ?? '[]');
    cache = Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === 'number') : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(ids: number[]) {
  cache = ids;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // Storage can be unavailable (private mode); favourites still work for this visit.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

const EMPTY: number[] = [];

export function useFavourites() {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY);
  const isFavourite = useCallback((id: number) => ids.includes(id), [ids]);
  const toggle = useCallback(
    (id: number) => write(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]),
    [ids],
  );
  return { ids, isFavourite, toggle };
}
