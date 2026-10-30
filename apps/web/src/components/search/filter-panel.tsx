'use client';

import { formatNumber, formatPrice, type Locale } from '@mahalla/shared';
import { Chip, SegmentedControl, Select, cn } from '@mahalla/ui';
import { useLocale, useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { COMMERCIAL_TYPES, RESIDENTIAL_TYPES } from '@/lib/catalog';
import type { LocationOption } from '@/lib/locations';
import {
  AREA_PRESETS,
  LAND_TYPES,
  activeFilterCount,
  defaultCurrency,
  filterProfile,
  pricePresets,
} from '@/lib/search-params';
import { LocationCombobox } from '../location-combobox';
import { type SearchState, useSearchNavigation } from './use-search-navigation';

function Group({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <fieldset
      className="grid gap-2.5 border-b border-sand-100 py-4 last:border-0"
      aria-labelledby={id}
    >
      <legend id={id} className="contents">
        <span className="text-sm font-semibold text-sand-900">{title}</span>
      </legend>
      {children}
    </fieldset>
  );
}

const BEDS = [0, 1, 2, 3, 4, 5];
const BATHS = [1, 2, 3, 4];

export function FilterPanel({
  state,
  location,
  className,
  showTitle = true,
}: {
  state: SearchState;
  location: LocationOption | null;
  className?: string;
  /** The mobile sheet has its own title bar. */
  showTitle?: boolean;
}) {
  const t = useTranslations('search');
  const tl = useTranslations('listing');
  const tc = useTranslations('catalog');
  const tn = useTranslations('nav');
  const locale = useLocale() as Locale;
  const { update, pending } = useSearchNavigation(state);
  const { purpose, category, filters } = state;
  const profile = filterProfile(category);
  const presets = pricePresets(purpose, filters.currency);
  const showRooms = profile === 'residential' && category !== 'residential_land';
  const activeCount = activeFilterCount(filters);

  const priceLabel = (n: number) =>
    formatPrice({ amount: n, currency: filters.currency }, locale, { compact: true });

  return (
    <div
      className={cn('transition-opacity', pending && 'opacity-60', className)}
      aria-busy={pending}
    >
      <div className={cn('flex items-center justify-between pb-2', !showTitle && 'pt-3')}>
        {showTitle ? <h2 className="text-base font-semibold">{t('filtersTitle')}</h2> : <span />}
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() =>
              update({
                filters: {
                  priceMin: undefined,
                  priceMax: undefined,
                  currency: defaultCurrency(purpose),
                  beds: [],
                  bathsMin: undefined,
                  areaMin: undefined,
                  areaMax: undefined,
                  furnishing: undefined,
                  deed: undefined,
                },
              })
            }
            className="text-sm font-semibold text-lapis-600 hover:text-lapis-700"
          >
            {t('clearAll')}
          </button>
        )}
      </div>

      <Group title={t('purpose')}>
        <SegmentedControl
          label={t('purpose')}
          value={purpose}
          onChange={(value) =>
            update({
              purpose: value,
              filters: {
                currency: defaultCurrency(value),
                priceMin: undefined,
                priceMax: undefined,
                deed: undefined,
                furnishing: undefined,
              },
            })
          }
          options={[
            { value: 'buy', label: tn('buy') },
            { value: 'rent', label: tn('rent') },
          ]}
          className="w-full [&>button]:flex-1"
        />
      </Group>

      <div className="border-b border-sand-100 py-4">
        <div className="rounded-sm border border-sand-200 bg-white px-3 py-2 focus-within:border-lapis-500">
          <LocationCombobox
            value={location}
            onChange={(next) => update({ locationPath: next?.path })}
          />
        </div>
      </div>

      <Group title={t('propertyType')}>
        <label htmlFor="filter-type" className="sr-only">
          {t('propertyType')}
        </label>
        <Select
          id="filter-type"
          value={category}
          onChange={(e) => {
            const next = e.target.value as SearchState['category'];
            update({
              category: next,
              filters:
                filterProfile(next) === 'residential'
                  ? {}
                  : { beds: [], bathsMin: undefined, furnishing: undefined },
            });
          }}
        >
          <option value="properties">{tc('categories.properties')}</option>
          <optgroup label={t('groups.residential')}>
            <option value="residential">{tc('plural.residential')}</option>
            {RESIDENTIAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {tc(`plural.${type}`)}
              </option>
            ))}
          </optgroup>
          <optgroup label={t('groups.commercial')}>
            <option value="commercial">{tc('plural.commercial')}</option>
            {COMMERCIAL_TYPES.map((type) => (
              <option key={type} value={type}>
                {tc(`plural.${type}`)}
              </option>
            ))}
          </optgroup>
          <optgroup label={t('groups.land')}>
            <option value="land">{tc('plural.land')}</option>
            {LAND_TYPES.filter((type) => type !== 'residential_land').map((type) => (
              <option key={type} value={type}>
                {tc(`plural.${type}`)}
              </option>
            ))}
          </optgroup>
        </Select>
      </Group>

      <Group title={t('price')}>
        <SegmentedControl
          label={t('currency')}
          value={filters.currency}
          onChange={(currency) =>
            update({ filters: { currency, priceMin: undefined, priceMax: undefined } })
          }
          options={[
            { value: 'IQD', label: t('currencyIQD') },
            { value: 'USD', label: t('currencyUSD') },
          ]}
        />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="price-min" className="mb-1 block text-xs text-sand-500">
              {t('min')}
            </label>
            <Select
              id="price-min"
              value={filters.priceMin ?? ''}
              onChange={(e) =>
                update({
                  filters: { priceMin: e.target.value ? Number(e.target.value) : undefined },
                })
              }
            >
              <option value="">{t('noMin')}</option>
              {presets
                .filter((p) => filters.priceMax === undefined || p < filters.priceMax)
                .map((p) => (
                  <option key={p} value={p}>
                    {priceLabel(p)}
                  </option>
                ))}
            </Select>
          </div>
          <div>
            <label htmlFor="price-max" className="mb-1 block text-xs text-sand-500">
              {t('max')}
            </label>
            <Select
              id="price-max"
              value={filters.priceMax ?? ''}
              onChange={(e) =>
                update({
                  filters: { priceMax: e.target.value ? Number(e.target.value) : undefined },
                })
              }
            >
              <option value="">{t('noMax')}</option>
              {presets
                .filter((p) => filters.priceMin === undefined || p > filters.priceMin)
                .map((p) => (
                  <option key={p} value={p}>
                    {priceLabel(p)}
                  </option>
                ))}
            </Select>
          </div>
        </div>
      </Group>

      {showRooms && (
        <>
          <Group title={t('bedrooms')}>
            <div className="flex flex-wrap gap-2">
              {BEDS.map((n) => {
                const selected = filters.beds.includes(n);
                return (
                  <Chip
                    key={n}
                    selected={selected}
                    onClick={() =>
                      update({
                        filters: {
                          beds: selected
                            ? filters.beds.filter((b) => b !== n)
                            : [...filters.beds, n],
                        },
                      })
                    }
                  >
                    {n === 0 ? tl('beds', { count: 0 }) : n === 5 ? t('atLeast', { count: 5 }) : n}
                  </Chip>
                );
              })}
            </div>
          </Group>
          <Group title={t('bathrooms')}>
            <div className="flex flex-wrap gap-2">
              {BATHS.map((n) => {
                const selected = filters.bathsMin === n;
                return (
                  <Chip
                    key={n}
                    selected={selected}
                    onClick={() => update({ filters: { bathsMin: selected ? undefined : n } })}
                  >
                    {t('atLeast', { count: n })}
                  </Chip>
                );
              })}
            </div>
          </Group>
        </>
      )}

      <Group title={profile === 'land' ? t('plotArea') : t('area')}>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="area-min" className="mb-1 block text-xs text-sand-500">
              {t('min')}
            </label>
            <Select
              id="area-min"
              value={filters.areaMin ?? ''}
              onChange={(e) =>
                update({
                  filters: { areaMin: e.target.value ? Number(e.target.value) : undefined },
                })
              }
            >
              <option value="">{t('noMin')}</option>
              {AREA_PRESETS.filter((p) => filters.areaMax === undefined || p < filters.areaMax).map(
                (p) => (
                  <option key={p} value={p}>
                    {formatNumber(p, locale)}
                  </option>
                ),
              )}
            </Select>
          </div>
          <div>
            <label htmlFor="area-max" className="mb-1 block text-xs text-sand-500">
              {t('max')}
            </label>
            <Select
              id="area-max"
              value={filters.areaMax ?? ''}
              onChange={(e) =>
                update({
                  filters: { areaMax: e.target.value ? Number(e.target.value) : undefined },
                })
              }
            >
              <option value="">{t('noMax')}</option>
              {AREA_PRESETS.filter((p) => filters.areaMin === undefined || p > filters.areaMin).map(
                (p) => (
                  <option key={p} value={p}>
                    {formatNumber(p, locale)}
                  </option>
                ),
              )}
            </Select>
          </div>
        </div>
      </Group>

      {purpose === 'rent' && showRooms && (
        <Group title={t('furnishing')}>
          <label htmlFor="furnishing" className="sr-only">
            {t('furnishing')}
          </label>
          <Select
            id="furnishing"
            value={filters.furnishing ?? ''}
            onChange={(e) =>
              update({
                filters: { furnishing: (e.target.value || undefined) as typeof filters.furnishing },
              })
            }
          >
            <option value="">{t('any')}</option>
            {(['furnished', 'semi_furnished', 'unfurnished'] as const).map((key) => (
              <option key={key} value={key}>
                {tc(`furnishing.${key}`)}
              </option>
            ))}
          </Select>
        </Group>
      )}

      {purpose === 'buy' && (
        <Group title={t('deed')}>
          <label htmlFor="deed" className="sr-only">
            {t('deed')}
          </label>
          <Select
            id="deed"
            value={filters.deed ?? ''}
            onChange={(e) =>
              update({ filters: { deed: (e.target.value || undefined) as typeof filters.deed } })
            }
          >
            <option value="">{t('any')}</option>
            {(['tabu_sirf', 'investment', 'agricultural', 'musha', 'contract'] as const).map(
              (key) => (
                <option key={key} value={key}>
                  {tc(`deed.${key}`)}
                </option>
              ),
            )}
          </Select>
        </Group>
      )}
    </div>
  );
}
