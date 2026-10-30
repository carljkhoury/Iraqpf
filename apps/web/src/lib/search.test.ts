import { describe, expect, it } from 'vitest';
import { searchListings } from './listings-repo';
import { filtersToQuery, locationFromSegments, parseFilters, searchHref } from './search-params';

describe('search params', () => {
  it('uses defaults when the query string is empty', () => {
    const f = parseFilters({}, 'buy');
    expect(f.beds).toEqual([]);
    expect(f.currency).toBe('USD');
    expect(f.sort).toBe('recommended');
    expect(filtersToQuery(f, 'buy')).toEqual({});
  });

  it('round-trips filters through the URL', () => {
    const f = parseFilters(
      { beds: '0,3', price_max: '200000', sort: 'price_asc', page: '2' },
      'buy',
    );
    expect(f.beds).toEqual([0, 3]);
    expect(
      searchHref({
        purpose: 'buy',
        category: 'apartment',
        locationPath: 'baghdad/karrada',
        filters: f,
      }),
    ).toBe('/buy/apartments/baghdad/karrada?price_max=200000&beds=0%2C3&sort=price_asc&page=2');
  });

  it('ignores invalid values', () => {
    const f = parseFilters(
      { beds: 'x,9', sort: 'cheapest', furnishing: 'maybe', page: '-3' },
      'rent',
    );
    expect(f.beds).toEqual([]);
    expect(f.sort).toBe('recommended');
    expect(f.furnishing).toBeUndefined();
    expect(f.page).toBe(1);
    expect(f.currency).toBe('IQD');
  });

  it('resolves location paths and rejects unknown ones', () => {
    expect(locationFromSegments(['baghdad', 'karrada'])?.name.en).toBe('Karrada');
    expect(locationFromSegments(['baghdad', 'nowhere'])).toBeNull();
    expect(locationFromSegments(undefined)).toBeUndefined();
  });
});

describe('searchListings', () => {
  const base = parseFilters({}, 'buy');

  it('returns listings for broad searches', () => {
    expect(
      searchListings({ purpose: 'buy', category: 'properties', filters: base }).total,
    ).toBeGreaterThan(20);
    expect(
      searchListings({
        purpose: 'rent',
        category: 'residential',
        filters: parseFilters({}, 'rent'),
      }).total,
    ).toBeGreaterThan(10);
  });

  it('filters by location, including everything inside a governorate', () => {
    const baghdad = locationFromSegments(['baghdad'])!;
    const { items, total } = searchListings({
      purpose: 'buy',
      category: 'properties',
      location: baghdad,
      filters: { ...base, page: 1 },
    });
    expect(total).toBeGreaterThan(0);
    expect(items.every((l) => l.locationPath.startsWith('baghdad/'))).toBe(true);
  });

  it('compares prices across currencies and sorts ascending', () => {
    const { items } = searchListings({
      purpose: 'buy',
      category: 'properties',
      filters: { ...base, priceMax: 200_000, sort: 'price_asc' },
    });
    expect(items.every((l) => l.priceUsd <= 200_000)).toBe(true);
    const prices = items.map((l) => l.priceUsd);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  it('matches 5+ bedrooms', () => {
    const { items } = searchListings({
      purpose: 'buy',
      category: 'residential',
      filters: { ...base, beds: [5] },
    });
    expect(items.every((l) => (l.bedrooms ?? 0) >= 5)).toBe(true);
  });
});
