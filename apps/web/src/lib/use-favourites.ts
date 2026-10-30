'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * A list of listing IDs kept in the browser during Phase 2. In Phase 3,
 * logged-in users' favourites and recently viewed listings move to the API
 * (`favourites` and `recently_viewed` tables) and these hooks sync with it.
 */
function createIdStore(key: string, max: number) {
  const listeners = new Set<() => void>();
  let cache: number[] | null = null;

  const read = (): number[] => {
    if (cache) return cache;
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(key) ?? '[]');
      cache = Array.isArray(parsed) ? parsed.filter((n): n is number => typeof n === 'number') : [];
    } catch {
      cache = [];
    }
    return cache;
  };

  const write = (ids: number[]) => {
    cache = ids.slice(0, max);
    try {
      window.localStorage.setItem(key, JSON.stringify(cache));
    } catch {
      // Storage can be unavailable (private mode); the list still works for this visit.
    }
    listeners.forEach((l) => l());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) {
        cache = null;
        listener();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener('storage', onStorage);
    };
  };

  return { read, write, subscribe };
}

const EMPTY: number[] = [];
const favourites = createIdStore('mahalla:favourites', 200);
const recent = createIdStore('mahalla:recently-viewed', 30);

export function useFavourites() {
  const ids = useSyncExternalStore(favourites.subscribe, favourites.read, () => EMPTY);
  const isFavourite = useCallback((id: number) => ids.includes(id), [ids]);
  const toggle = useCallback(
    (id: number) => favourites.write(ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids]),
    [ids],
  );
  return { ids, isFavourite, toggle };
}

export function useRecentlyViewed() {
  const ids = useSyncExternalStore(recent.subscribe, recent.read, () => EMPTY);
  const record = useCallback(
    (id: number) => recent.write([id, ...recent.read().filter((x) => x !== id)]),
    [],
  );
  const clear = useCallback(() => recent.write([]), []);
  return { ids, record, clear };
}
