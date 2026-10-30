'use client';

import { Button, SegmentedControl } from '@mahalla/ui';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import {
  COMMERCIAL_TYPES,
  type CategoryGroupKey,
  type CategoryKey,
  type PurposeSlug,
  RESIDENTIAL_TYPES,
  SALE_ONLY_TYPES,
  searchPath,
} from '@/lib/catalog';
import type { LocationOption } from '@/lib/locations';
import { LocationCombobox } from './location-combobox';

type Tab = 'buy' | 'rent' | 'commercial';

export function HeroSearch() {
  const t = useTranslations('hero');
  const tc = useTranslations('catalog.categories');
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('buy');
  const [commercialPurpose, setCommercialPurpose] = useState<PurposeSlug>('rent');
  const [location, setLocation] = useState<LocationOption | null>(null);
  const [category, setCategory] = useState<CategoryKey | CategoryGroupKey>('residential');

  const isCommercial = tab === 'commercial';
  const types = isCommercial
    ? COMMERCIAL_TYPES
    : RESIDENTIAL_TYPES.filter((c) => tab === 'buy' || !SALE_ONLY_TYPES.includes(c));
  const group: CategoryGroupKey = isCommercial ? 'commercial' : 'residential';

  function changeTab(next: Tab) {
    setTab(next);
    setCategory(next === 'commercial' ? 'commercial' : 'residential');
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const purpose: PurposeSlug = isCommercial ? commercialPurpose : tab;
    router.push(searchPath(purpose, category, location?.path));
  }

  return (
    <form
      onSubmit={submit}
      role="search"
      aria-label={t('submit')}
      className="rounded-xl bg-lapis-800/95 p-3 shadow-overlay sm:p-5"
    >
      <div className="flex flex-wrap items-center gap-3">
        <SegmentedControl
          tone="dark"
          label={t('purposeLabel')}
          value={tab}
          onChange={changeTab}
          options={[
            { value: 'buy', label: t('tabs.buy') },
            { value: 'rent', label: t('tabs.rent') },
            { value: 'commercial', label: t('tabs.commercial') },
          ]}
        />
        {isCommercial && (
          <SegmentedControl
            tone="dark"
            label={t('purposeLabel')}
            value={commercialPurpose}
            onChange={setCommercialPurpose}
            options={[
              { value: 'rent', label: t('commercialPurpose.rent') },
              { value: 'buy', label: t('commercialPurpose.buy') },
            ]}
          />
        )}
      </div>

      <div className="mt-3 grid gap-2 rounded-lg bg-white p-2 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] md:gap-0">
        <div className="border-sand-100 px-3 py-1.5 max-md:border-b md:border-e">
          <LocationCombobox value={location} onChange={setLocation} />
        </div>
        <div className="px-3 py-1.5">
          <label htmlFor="hero-type" className="block text-xs text-sand-500">
            {t('typeLabel')}
          </label>
          <select
            id="hero-type"
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryKey | CategoryGroupKey)}
            className="h-7 w-full cursor-pointer bg-transparent text-[15px] font-medium text-sand-900 focus:outline-none"
          >
            <option value={group}>{tc(group)}</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {tc(type)}
              </option>
            ))}
          </select>
        </div>
        <Button type="submit" size="lg" className="h-auto min-h-12 md:px-8">
          <Search className="size-5" aria-hidden />
          {t('submit')}
        </Button>
      </div>
    </form>
  );
}
