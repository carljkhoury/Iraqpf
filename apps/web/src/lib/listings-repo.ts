import type { Currency } from '@mahalla/shared';
import type { CategoryGroupKey, CategoryKey, PurposeSlug } from './catalog';
import { USD_TO_IQD } from './exchange';
import type { LocationOption } from './locations';
import { normalizeForSearch } from '@mahalla/shared';
import {
  type AgencyProfile,
  type ListingCardData,
  SAMPLE_AGENCIES,
  SAMPLE_LISTINGS,
} from './sample-data';
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
 * Filters and sorts the sample listings. Phase 3 replaces this with the
 * `search` API module (PostgreSQL); the query and result shapes stay the same.
 */
function matchListings({ purpose, category, location, filters }: SearchQuery): ListingCardData[] {
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

  return sorted;
}

export function searchListings(query: SearchQuery): SearchResult {
  const sorted = matchListings(query);
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const page = Math.min(query.filters.page, pageCount);
  return {
    items: sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total: sorted.length,
    page,
    pageCount,
  };
}

/** Every match (no pagination) for the map view. The API caps this at 500 in Phase 3. */
export function searchAllListings(query: SearchQuery): ListingCardData[] {
  return matchListings(query).slice(0, 500);
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

export function getAgency(slug: string): AgencyProfile | undefined {
  return SAMPLE_AGENCIES.find((a) => a.slug === slug);
}

export function listAgencies({ city, q }: { city?: string; q?: string }): AgencyProfile[] {
  const query = q ? normalizeForSearch(q) : '';
  return SAMPLE_AGENCIES.filter(
    (a) =>
      (!city || a.cityKey === city) &&
      (!query ||
        normalizeForSearch(a.name.ar).includes(query) ||
        normalizeForSearch(a.name.en).includes(query)),
  ).sort((a, b) => Number(b.verified) - Number(a.verified) || b.listingCount - a.listingCount);
}

export function agencyListings(slug: string, purpose: 'sale' | 'rent', page: number): SearchResult {
  const all = SAMPLE_LISTINGS.filter(
    (l) =>
      l.advertiser.slug === slug &&
      (purpose === 'sale'
        ? l.purpose === 'sale'
        : l.purpose === 'rent' || l.purpose === 'key_money'),
  ).sort((a, b) => Number(b.featured) - Number(a.featured) || b.postedAt.localeCompare(a.postedAt));
  const pageCount = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const current = Math.min(Math.max(1, page), pageCount);
  return {
    items: all.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE),
    total: all.length,
    page: current,
    pageCount,
  };
}

export function agencyStats(slug: string) {
  const mine = SAMPLE_LISTINGS.filter((l) => l.advertiser.slug === slug);
  const byAgent = new Map<string, number>();
  for (const l of mine) {
    const agent = l.advertiser.agent?.slug;
    if (agent) byAgent.set(agent, (byAgent.get(agent) ?? 0) + 1);
  }
  return {
    total: mine.length,
    sale: mine.filter((l) => l.purpose === 'sale').length,
    rent: mine.filter((l) => l.purpose !== 'sale').length,
    byAgent,
  };
}
