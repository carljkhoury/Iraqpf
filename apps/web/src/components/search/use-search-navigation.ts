'use client';

import { useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { type SearchFilters, type SearchState, searchHref } from '@/lib/search-params';

export type { SearchState };

/**
 * Applies a change to the current search by navigating to its URL, so every
 * search state is shareable and works with the back button. Filter changes
 * reset to page 1.
 */
export function useSearchNavigation(current: SearchState) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function update(
    change: Partial<Omit<SearchState, 'filters'>> & { filters?: Partial<SearchFilters> },
  ) {
    const next: SearchState = {
      ...current,
      ...change,
      filters: { ...current.filters, page: 1, ...change.filters },
    };
    startTransition(() => router.replace(searchHref(next), { scroll: false }));
  }

  return { update, pending };
}
