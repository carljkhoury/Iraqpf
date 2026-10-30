import type { Currency } from '@mahalla/shared';
/** URL query-string filters for search pages. Safe to import in the browser. */
import {
  CATEGORY_SLUGS,
  COMMERCIAL_TYPES,
  type CategoryGroupKey,
  type CategoryKey,
  type PurposeSlug,
  RESIDENTIAL_TYPES,
  searchPath,
} from './catalog';
import { LOCATIONS, type LocationOption } from './locations';
import type { DeedKey, FurnishingKey } from './sample-data';

export type SortKey = 'recommended' | 'newest' | 'price_asc' | 'price_desc';
export const SORT_KEYS: SortKey[] = ['recommended', 'newest', 'price_asc', 'price_desc'];
export type ViewKey = 'grid' | 'list' | 'map';

export const LAND_TYPES: CategoryKey[] = [
  'residential_land',
  'commercial_land',
  'agricultural_land',
  'farm',
  'industrial_land',
];

export const GROUP_MEMBERS: Record<CategoryGroupKey, CategoryKey[] | null> = {
  properties: null,
  residential: RESIDENTIAL_TYPES,
  commercial: COMMERCIAL_TYPES,
  land: LAND_TYPES,
};

/** Which filter set a category uses (docs/06-catalog.md §7). */
export type FilterProfile = 'residential' | 'commercial' | 'land';

export function filterProfile(category: CategoryKey | CategoryGroupKey): FilterProfile {
  if (category === 'commercial' || COMMERCIAL_TYPES.includes(category as CategoryKey))
    return 'commercial';
  if (category === 'land' || LAND_TYPES.includes(category as CategoryKey)) return 'land';
  return 'residential';
}

const SLUG_TO_CATEGORY = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([key, slug]) => [slug, key]),
) as Record<string, CategoryKey | CategoryGroupKey>;

export function categoryFromSlug(slug: string): CategoryKey | CategoryGroupKey | null {
  return SLUG_TO_CATEGORY[slug] ?? null;
}

export function locationFromSegments(
  segments: string[] | undefined,
): LocationOption | null | undefined {
  if (!segments || segments.length === 0) return undefined;
  const path = segments.map(decodeURIComponent).join('/');
  return LOCATIONS.find((l) => l.path === path) ?? null;
}

/** Filters that live in the query string (the path holds purpose, category, location). */
export interface SearchFilters {
  priceMin?: number;
  priceMax?: number;
  currency: Currency;
  beds: number[];
  bathsMin?: number;
  areaMin?: number;
  areaMax?: number;
  furnishing?: FurnishingKey;
  deed?: DeedKey;
  sort: SortKey;
  view: ViewKey;
  page: number;
}

type RawParams = Record<string, string | string[] | undefined>;

function num(value: string | string[] | undefined): number | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}
function str(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function defaultCurrency(purpose: PurposeSlug): Currency {
  return purpose === 'buy' ? 'USD' : 'IQD';
}

export function parseFilters(params: RawParams, purpose: PurposeSlug): SearchFilters {
  const sort = str(params.sort) as SortKey | undefined;
  const furnishing = str(params.furnishing) as FurnishingKey | undefined;
  const deed = str(params.deed) as DeedKey | undefined;
  const currency = str(params.currency);
  return {
    priceMin: num(params.price_min),
    priceMax: num(params.price_max),
    currency: currency === 'USD' || currency === 'IQD' ? currency : defaultCurrency(purpose),
    beds: (str(params.beds) ?? '')
      .split(',')
      .filter((v) => v.trim() !== '')
      .map(Number)
      .filter((n) => Number.isInteger(n) && n >= 0 && n <= 5),
    bathsMin: num(params.baths),
    areaMin: num(params.area_min),
    areaMax: num(params.area_max),
    furnishing: ['furnished', 'semi_furnished', 'unfurnished'].includes(furnishing ?? '')
      ? furnishing
      : undefined,
    deed: ['tabu_sirf', 'agricultural', 'musha', 'investment', 'contract'].includes(deed ?? '')
      ? deed
      : undefined,
    sort: sort && SORT_KEYS.includes(sort) ? sort : 'recommended',
    view: str(params.view) === 'list' ? 'list' : str(params.view) === 'map' ? 'map' : 'grid',
    page: Math.max(1, Math.floor(num(params.page) ?? 1)),
  };
}

/** Serializes filters back to a query string, omitting defaults. */
export function filtersToQuery(
  filters: SearchFilters,
  purpose: PurposeSlug,
): Record<string, string> {
  const q: Record<string, string> = {};
  if (filters.priceMin !== undefined) q.price_min = String(filters.priceMin);
  if (filters.priceMax !== undefined) q.price_max = String(filters.priceMax);
  if (
    (filters.priceMin !== undefined || filters.priceMax !== undefined) &&
    filters.currency !== defaultCurrency(purpose)
  )
    q.currency = filters.currency;
  if (filters.beds.length) q.beds = [...filters.beds].sort().join(',');
  if (filters.bathsMin !== undefined) q.baths = String(filters.bathsMin);
  if (filters.areaMin !== undefined) q.area_min = String(filters.areaMin);
  if (filters.areaMax !== undefined) q.area_max = String(filters.areaMax);
  if (filters.furnishing) q.furnishing = filters.furnishing;
  if (filters.deed) q.deed = filters.deed;
  if (filters.sort !== 'recommended') q.sort = filters.sort;
  if (filters.view !== 'grid') q.view = filters.view;
  if (filters.page > 1) q.page = String(filters.page);
  return q;
}

export function activeFilterCount(filters: SearchFilters): number {
  return [
    filters.priceMin !== undefined || filters.priceMax !== undefined,
    filters.beds.length > 0,
    filters.bathsMin !== undefined,
    filters.areaMin !== undefined || filters.areaMax !== undefined,
    Boolean(filters.furnishing),
    Boolean(filters.deed),
  ].filter(Boolean).length;
}

/** Price presets for the min/max selects, per purpose and currency. */
export function pricePresets(purpose: PurposeSlug, currency: Currency): number[] {
  if (purpose === 'buy') {
    return currency === 'USD'
      ? [25e3, 50e3, 75e3, 100e3, 150e3, 200e3, 250e3, 300e3, 400e3, 500e3, 750e3, 1e6, 2e6]
      : [25e6, 50e6, 100e6, 150e6, 200e6, 300e6, 400e6, 500e6, 750e6, 1e9, 2e9];
  }
  return currency === 'USD'
    ? [250, 500, 750, 1000, 1500, 2000, 3000, 5000, 10000]
    : [250e3, 500e3, 750e3, 1e6, 1.5e6, 2e6, 3e6, 5e6, 10e6];
}

export const AREA_PRESETS = [
  50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 2500, 5000, 10000, 25000,
];

export interface SearchState {
  purpose: PurposeSlug;
  category: CategoryKey | CategoryGroupKey;
  locationPath?: string;
  filters: SearchFilters;
}

/** Full URL (path + query) for a search state. Works on server and client. */
export function searchHref(state: SearchState): string {
  const path = searchPath(state.purpose, state.category, state.locationPath);
  const query = new URLSearchParams(filtersToQuery(state.filters, state.purpose)).toString();
  return query ? `${path}?${query}` : path;
}
