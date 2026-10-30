'use client';

import { Button } from '@mahalla/ui';
import * as Dialog from '@radix-ui/react-dialog';
import { SlidersHorizontal, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import type { LocationOption } from '@/lib/locations';
import { activeFilterCount } from '@/lib/search-params';
import { FilterPanel } from './filter-panel';
import type { SearchState } from './use-search-navigation';

/** Full-screen filter sheet for phones; results update live behind it. */
export function MobileFilters({
  state,
  location,
  total,
}: {
  state: SearchState;
  location: LocationOption | null;
  total: number;
}) {
  const t = useTranslations('search');
  const tc = useTranslations('common');
  const [open, setOpen] = useState(false);
  const count = activeFilterCount(state.filters);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="secondary" size="sm" className="lg:hidden">
          <SlidersHorizontal className="size-4" aria-hidden />
          {t('filters')}
          {count > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-lapis-600 text-[11px] text-white">
              {count}
            </span>
          )}
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          className="fixed inset-0 z-50 flex flex-col bg-white"
          aria-describedby={undefined}
        >
          <div className="flex h-14 items-center justify-between border-b border-sand-200 px-4">
            <Dialog.Title className="text-base font-semibold">{t('filters')}</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label={tc('close')}>
                <X className="size-6" aria-hidden />
              </Button>
            </Dialog.Close>
          </div>
          <div className="flex-1 overflow-y-auto px-4">
            <FilterPanel state={state} location={location} showTitle={false} />
          </div>
          <div className="border-t border-sand-200 p-4">
            <Button size="lg" className="w-full" onClick={() => setOpen(false)}>
              {t('showResults', { count: total })}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
