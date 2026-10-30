'use client';

import type { Map as MapLibreMap, MapOptions } from 'maplibre-gl';
import { MAP_STYLE_URL } from '@/lib/map-config';

export type MapLibre = typeof import('maplibre-gl');

/**
 * Creates a MapLibre map with Mahalla defaults. The library (~250 KB gzipped)
 * is loaded only when a map is actually shown.
 */
export async function createMap(
  container: HTMLElement,
  locale: 'ar' | 'en',
  options: Partial<MapOptions> = {},
): Promise<{ map: MapLibreMap; lib: MapLibre }> {
  const lib = await import('maplibre-gl');
  // Served from /public (copied at build time by scripts/copy-map-worker.mjs).
  lib.setWorkerUrl(`/vendor/maplibre-gl-worker-${lib.getVersion()}.mjs`);
  const map = new lib.Map({
    container,
    style: MAP_STYLE_URL,
    attributionControl: { compact: true },
    dragRotate: false,
    pitchWithRotate: false,
    ...options,
  });
  map.touchZoomRotate.disableRotation();
  // Controls sit on the "end" side: left in Arabic, right in English.
  map.addControl(
    new lib.NavigationControl({ showCompass: false }),
    locale === 'ar' ? 'top-left' : 'top-right',
  );

  // Show street and place names in the visitor's language where OpenStreetMap has them.
  map.on('style.load', () => {
    for (const layer of map.getStyle().layers ?? []) {
      if (layer.type !== 'symbol' || !map.getLayoutProperty(layer.id, 'text-field')) continue;
      map.setLayoutProperty(layer.id, 'text-field', [
        'coalesce',
        ['get', `name:${locale}`],
        ['get', locale === 'en' ? 'name:latin' : 'name'],
        ['get', 'name'],
      ]);
    }
  });
  return { map, lib };
}
