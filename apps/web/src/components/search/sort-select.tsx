'use client';

import { Select } from '@mahalla/ui';
import { useTranslations } from 'next-intl';
import { SORT_KEYS, type SortKey } from '@/lib/search-params';
import { type SearchState, useSearchNavigation } from './use-search-navigation';

export function SortSelect({ state }: { state: SearchState }) {
  const t = useTranslations('search');
  const { update } = useSearchNavigation(state);
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="hidden text-sm whitespace-nowrap text-sand-500 sm:block">
        {t('sort')}
      </label>
      <Select
        id="sort"
        aria-label={t('sort')}
        value={state.filters.sort}
        onChange={(e) => update({ filters: { sort: e.target.value as SortKey } })}
        className="h-9 w-auto min-w-40 text-sm"
      >
        {SORT_KEYS.map((key) => (
          <option key={key} value={key}>
            {t(`sortOptions.${key}`)}
          </option>
        ))}
      </Select>
    </div>
  );
}
