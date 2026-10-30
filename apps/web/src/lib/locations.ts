import seed from '@mahalla/db/seed/locations';
import { type LocalizedText, normalizeForSearch } from '@mahalla/shared';

type SeedType = 'governorate' | 'city' | 'district' | 'neighbourhood' | 'compound';

interface SeedNode {
  slug: string;
  type: string;
  name: LocalizedText;
  center?: { lat: number; lng: number };
  children?: SeedNode[];
}

export interface LocationOption {
  /** URL path, e.g. `baghdad/karrada` (city segment omitted when it repeats the governorate). */
  path: string;
  type: SeedType;
  name: LocalizedText;
  /** Parent chain for display, e.g. { ar: 'بغداد', en: 'Baghdad' }. */
  parent: LocalizedText | null;
  /** Normalized Arabic + English names for matching. */
  searchKeys: string[];
  /** Map centre [lng, lat]; neighbourhoods without one inherit their parent's. */
  center: [number, number] | null;
}

function build(
  nodes: SeedNode[],
  pathSegments: string[] = [],
  displayParent: LocalizedText | null = null,
  parentSlug?: string,
  parentCenter: [number, number] | null = null,
): LocationOption[] {
  return nodes.flatMap((node) => {
    // A city that repeats its governorate (Baghdad inside Baghdad) is folded into it.
    const folded = node.type === 'city' && node.slug === parentSlug;
    const center: [number, number] | null = node.center
      ? [node.center.lng, node.center.lat]
      : parentCenter;
    const segments = folded ? pathSegments : [...pathSegments, node.slug];
    const self: LocationOption[] = folded
      ? []
      : [
          {
            path: segments.join('/'),
            type: node.type as SeedType,
            name: node.name,
            parent: displayParent,
            searchKeys: [normalizeForSearch(node.name.ar), normalizeForSearch(node.name.en)],
            center,
          },
        ];
    const childParent = folded ? displayParent : node.name;
    return [...self, ...build(node.children ?? [], segments, childParent, node.slug, center)];
  });
}

export const LOCATIONS: LocationOption[] = build((seed as { locations: SeedNode[] }).locations);

const TYPE_RANK: Record<SeedType, number> = {
  governorate: 0,
  city: 1,
  district: 2,
  neighbourhood: 3,
  compound: 3,
};

/** Prefix matches first, then substring matches; governorates before neighbourhoods. */
export function searchLocations(query: string, limit = 8): LocationOption[] {
  const q = normalizeForSearch(query);
  if (!q) return [];
  const scored: { option: LocationOption; score: number }[] = [];
  for (const option of LOCATIONS) {
    let score = -1;
    for (const key of option.searchKeys) {
      if (key.startsWith(q)) score = Math.max(score, 2);
      else if (key.split(' ').some((word) => word.startsWith(q))) score = Math.max(score, 1.5);
      else if (key.includes(q)) score = Math.max(score, 1);
    }
    if (score > 0) scored.push({ option, score: score * 10 - TYPE_RANK[option.type] });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.option);
}

/** Zoom level that frames a location type on the map. */
export function zoomFor(type: LocationOption['type']): number {
  return type === 'governorate' ? 9 : type === 'city' ? 11 : 13;
}
