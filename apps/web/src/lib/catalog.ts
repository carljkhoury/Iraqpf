/**
 * Static catalog used by the UI during Phase 2. In Phase 3 this comes from the
 * `catalog` API module (docs/05-database.md §6), with the same keys.
 */

export type CategoryKey =
  | 'apartment'
  | 'house'
  | 'villa'
  | 'floor'
  | 'annex'
  | 'residential_building'
  | 'residential_land'
  | 'office'
  | 'shop'
  | 'showroom'
  | 'warehouse'
  | 'commercial_building'
  | 'commercial_land'
  | 'hotel'
  | 'factory'
  | 'agricultural_land'
  | 'farm'
  | 'industrial_land';

export type CategoryGroupKey = 'properties' | 'residential' | 'commercial' | 'land';

/** URL slugs (Latin in both languages, decision Q-03). */
export const CATEGORY_SLUGS: Record<CategoryKey | CategoryGroupKey, string> = {
  properties: 'properties',
  residential: 'residential',
  commercial: 'commercial',
  land: 'land',
  apartment: 'apartments',
  house: 'houses',
  villa: 'villas',
  floor: 'floors',
  annex: 'annexes',
  residential_building: 'residential-buildings',
  residential_land: 'residential-land',
  office: 'offices',
  shop: 'shops',
  showroom: 'showrooms',
  warehouse: 'warehouses',
  commercial_building: 'commercial-buildings',
  commercial_land: 'commercial-land',
  hotel: 'hotels',
  factory: 'factories',
  agricultural_land: 'agricultural-land',
  farm: 'farms',
  industrial_land: 'industrial-land',
};

export const RESIDENTIAL_TYPES: CategoryKey[] = [
  'apartment',
  'house',
  'villa',
  'floor',
  'annex',
  'residential_building',
  'residential_land',
];

export const COMMERCIAL_TYPES: CategoryKey[] = [
  'office',
  'shop',
  'showroom',
  'warehouse',
  'commercial_building',
  'commercial_land',
  'hotel',
  'factory',
];

/** Categories that are only offered for sale in the homepage search. */
export const SALE_ONLY_TYPES: CategoryKey[] = ['residential_land'];

export type PurposeSlug = 'buy' | 'rent';

export function searchPath(
  purpose: PurposeSlug,
  category: CategoryKey | CategoryGroupKey,
  locationPath?: string,
): string {
  return ['', purpose, CATEGORY_SLUGS[category], locationPath]
    .filter((s) => s !== undefined)
    .join('/');
}
