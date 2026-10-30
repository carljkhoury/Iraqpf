import type { Currency } from '@mahalla/shared';
import type { CategoryGroupKey, CategoryKey, PurposeSlug } from './catalog';
import { USD_TO_IQD } from './exchange';
import type { LocationOption } from './locations';
import { type ListingCardData, SAMPLE_LISTINGS } from './sample-data';
import { GROUP_MEMBERS, type SearchFilters } from './search-params';

export const PAGE_SIZE = 12;

export interface SearchQuery {
  purpose: PurposeSlug;
  category: CategoryKey | CategoryGroupKey;
  location?: LocationOption;
  filters: SearchFilters;
}

export interface SearchResult {
  items: ListingCardData[];
  total: number;
  page: number;
  pageCount: number;
}

function toUsd(amount: number, currency: Currency): number {
  return currency === 'USD' ? amount : amount / USD_TO_IQD;
}

/**
 * Searches the sample listings. Phase 3 replaces this with the `search` API
 * module (PostgreSQL); the query and result shapes stay the same.
 */
export function searchListings({
  purpose,
  category,
  location,
  filters,
}: SearchQuery): SearchResult {
  const members = GROUP_MEMBERS[category as CategoryGroupKey];
  const categories = members === undefined ? [category as CategoryKey] : members;
  const purposes = purpose === 'buy' ? ['sale'] : ['rent', 'key_money'];
  const minUsd =
    filters.priceMin !== undefined ? toUsd(filters.priceMin, filters.currency) : undefined;
  const maxUsd =
    filters.priceMax !== undefined ? toUsd(filters.priceMax, filters.currency) : undefined;

  const matches = SAMPLE_LISTINGS.filter((l) => {
    if (!purposes.includes(l.purpose)) return false;
    if (categories && !categories.includes(l.category)) return false;
    if (
      location &&
      !(l.locationPath === location.path || l.locationPath.startsWith(`${location.path}/`))
    )
      return false;
    if (minUsd !== undefined && l.priceUsd < minUsd) return false;
    if (maxUsd !== undefined && l.priceUsd > maxUsd) return false;
    if (filters.beds.length) {
      if (l.bedrooms === undefined) return false;
      const ok = filters.beds.some((b) => (b === 5 ? l.bedrooms! >= 5 : l.bedrooms === b));
      if (!ok) return false;
    }
    if (filters.bathsMin !== undefined && (l.bathrooms ?? 0) < filters.bathsMin) return false;
    if (filters.areaMin !== undefined && l.areaM2 < filters.areaMin) return false;
    if (filters.areaMax !== undefined && l.areaM2 > filters.areaMax) return false;
    if (filters.furnishing && l.furnishing !== filters.furnishing) return false;
    if (filters.deed && l.deed !== filters.deed) return false;
    return true;
  });

  const byDate = (a: ListingCardData, b: ListingCardData) => b.postedAt.localeCompare(a.postedAt);
  const sorted = [...matches].sort((a, b) => {
    switch (filters.sort) {
      case 'newest':
        return byDate(a, b);
      case 'price_asc':
        return a.priceUsd - b.priceUsd;
      case 'price_desc':
        return b.priceUsd - a.priceUsd;
      default:
        return Number(b.featured) - Number(a.featured) || byDate(a, b);
    }
  });

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(filters.page, pageCount);
  return {
    items: sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: sorted.length,
    page,
    pageCount,
  };
}

export function featuredListings(limit: number): ListingCardData[] {
  return SAMPLE_LISTINGS.filter((l) => l.featured).slice(0, limit);
}

export function recentListings(limit: number): ListingCardData[] {
  return [...SAMPLE_LISTINGS]
    .filter((l) => !l.featured)
    .sort((a, b) => b.postedAt.localeCompare(a.postedAt))
    .slice(0, limit);
}

export function getListing(id: number): ListingCardData | undefined {
  return SAMPLE_LISTINGS.find((l) => l.id === id);
}

/** Same type and purpose nearby first, then same purpose in the same city. */
export function similarListings(listing: ListingCardData, limit: number): ListingCardData[] {
  const city = listing.locationPath.split('/')[0];
  const score = (l: ListingCardData) =>
    (l.category === listing.category ? 4 : 0) +
    (l.locationPath === listing.locationPath ? 2 : 0) +
    (l.locationPath.startsWith(`${city}/`) ? 1 : 0);
  return SAMPLE_LISTINGS.filter((l) => l.id !== listing.id && l.purpose === listing.purpose)
    .map((l) => ({ l, s: score(l) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s || b.l.postedAt.localeCompare(a.l.postedAt))
    .slice(0, limit)
    .map(({ l }) => l);
}
