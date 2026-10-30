/**
 * Map provider settings (decision I-02: free OpenStreetMap-based maps now,
 * replaceable later). OpenFreeMap needs no API key and allows commercial use.
 * Swap the style URL (e.g. self-hosted Protomaps on R2) without touching components.
 */
export const MAP_STYLE_URL =
  process.env.NEXT_PUBLIC_MAP_STYLE_URL ?? 'https://tiles.openfreemap.org/styles/liberty';

/** Whole-of-Iraq view: [longitude, latitude]. */
export const IRAQ_CENTER: [number, number] = [43.9, 33.4];
export const IRAQ_ZOOM = 4.8;
