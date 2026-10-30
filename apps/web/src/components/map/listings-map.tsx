'use client';

import 'maplibre-gl/dist/maplibre-gl.css';

import { cn } from '@mahalla/ui';
import type { Map as MapLibreMap, Marker } from 'maplibre-gl';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { IRAQ_CENTER, IRAQ_ZOOM } from '@/lib/map-config';
import { createMap } from './create-map';

export interface MapPoint {
  id: number;
  lat: number;
  lng: number;
  /** Short price for the pin, e.g. "$285K". */
  label: string;
  featured: boolean;
}

interface ListingsMapProps {
  points: MapPoint[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  /** Where to look when there are no results: [lng, lat]. */
  fallbackCenter?: [number, number];
  fallbackZoom?: number;
  className?: string;
}

// Pin appearance is driven by data-state so MapLibre's own positioning classes are never touched.
const PIN_CLASS = [
  'mahalla-pin rounded-full border px-2.5 py-1 text-[13px] font-bold whitespace-nowrap shadow-raised',
  'focus-visible:outline-2 focus-visible:outline-lapis-500',
  'data-[state=normal]:border-sand-200 data-[state=normal]:bg-white data-[state=normal]:text-sand-900',
  'data-[state=featured]:border-gold-300 data-[state=featured]:bg-gold-100 data-[state=featured]:text-sand-900',
  'data-[state=selected]:border-lapis-700 data-[state=selected]:bg-lapis-700 data-[state=selected]:text-white',
].join(' ');

/**
 * Search results map: price pins that group into numbered clusters when they
 * overlap. Clicking a pin selects the listing; clicking a cluster zooms in.
 */
export function ListingsMap({
  points,
  selectedId,
  onSelect,
  fallbackCenter = IRAQ_CENTER,
  fallbackZoom = IRAQ_ZOOM,
  className,
}: ListingsMapProps) {
  const t = useTranslations('map');
  const tl = useTranslations('listing');
  const locale = useLocale() as 'ar' | 'en';
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef(new Map<string, Marker>());
  const pinElements = useRef(new Map<number, HTMLButtonElement>());
  const onSelectRef = useRef(onSelect);
  const selectedRef = useRef(selectedId);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    const markers = markersRef.current;
    const pins = pinElements.current;

    createMap(containerRef.current!, locale, { center: fallbackCenter, zoom: fallbackZoom })
      .then(({ map, lib }) => {
        if (cancelled) {
          map.remove();
          return;
        }
        mapRef.current = map;
        map.on('error', (e) => {
          if (!map.isStyleLoaded() && e.error?.message?.includes('style')) setStatus('error');
        });
        map.on('load', () => {
          map.addSource('listings', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
            cluster: true,
            clusterRadius: 48,
            clusterMaxZoom: 15,
          });
          // An invisible layer keeps the source's tiles loaded so markers can be read from it.
          map.addLayer({
            id: 'listings-hit',
            type: 'circle',
            source: 'listings',
            paint: { 'circle-opacity': 0, 'circle-radius': 1 },
          });
          setStatus('ready');
        });
        map.on('click', () => onSelectRef.current(null));

        const sync = () => {
          if (!map.getSource('listings') || !map.isSourceLoaded('listings')) return;
          const seen = new Set<string>();
          for (const feature of map.querySourceFeatures('listings')) {
            const props = feature.properties as Record<string, unknown>;
            const [lng, lat] = (feature.geometry as { coordinates: number[] }).coordinates as [
              number,
              number,
            ];
            const key = props.cluster ? `c${props.cluster_id}` : `p${props.id}`;
            if (seen.has(key)) continue;
            seen.add(key);
            if (markers.has(key)) continue;

            const el = document.createElement('button');
            el.type = 'button';
            if (props.cluster) {
              const count = Number(props.point_count);
              el.className =
                'grid size-10 place-items-center rounded-full border-2 border-white bg-lapis-600 text-sm font-bold text-white shadow-raised hover:bg-lapis-700';
              el.textContent = String(count);
              el.setAttribute('aria-label', tl('count', { count }));
              el.addEventListener('click', async (e) => {
                e.stopPropagation();
                const source = map.getSource('listings') as import('maplibre-gl').GeoJSONSource;
                const zoom = await source.getClusterExpansionZoom(Number(props.cluster_id));
                map.easeTo({ center: [lng, lat], zoom });
              });
            } else {
              const id = Number(props.id);
              el.className = PIN_CLASS;
              el.dataset.featured = String(props.featured);
              el.dataset.state =
                id === selectedRef.current ? 'selected' : props.featured ? 'featured' : 'normal';
              el.dir = 'auto';
              el.textContent = String(props.label);
              el.setAttribute('aria-label', String(props.label));
              el.addEventListener('click', (e) => {
                e.stopPropagation();
                onSelectRef.current(id);
              });
              pins.set(id, el);
            }
            markers.set(key, new lib.Marker({ element: el }).setLngLat([lng, lat]).addTo(map));
          }
          for (const [key, marker] of markers) {
            if (!seen.has(key)) {
              marker.remove();
              markers.delete(key);
              if (key.startsWith('p')) pins.delete(Number(key.slice(1)));
            }
          }
        };
        map.on('render', sync);
      })
      .catch(() => setStatus('error'));

    return () => {
      cancelled = true;
      markers.forEach((m) => m.remove());
      markers.clear();
      pins.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // The map is created once per mount; data updates are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  // Push new results into the map and frame them.
  useEffect(() => {
    const map = mapRef.current;
    if (status !== 'ready' || !map) return;
    const source = map.getSource('listings') as import('maplibre-gl').GeoJSONSource | undefined;
    source?.setData({
      type: 'FeatureCollection',
      features: points.map((p) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
        properties: { id: p.id, label: p.label, featured: p.featured },
      })),
    });
    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();
    pinElements.current.clear();

    if (points.length === 0) {
      map.easeTo({ center: fallbackCenter, zoom: fallbackZoom });
    } else if (points.length === 1) {
      map.easeTo({ center: [points[0]!.lng, points[0]!.lat], zoom: 14 });
    } else {
      const lngs = points.map((p) => p.lng);
      const lats = points.map((p) => p.lat);
      map.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        { padding: 64, maxZoom: 14, duration: 0 },
      );
    }
  }, [points, status, fallbackCenter, fallbackZoom]);

  // Highlight the selected pin.
  useEffect(() => {
    selectedRef.current = selectedId;
    pinElements.current.forEach((el, id) => {
      el.dataset.state =
        id === selectedId ? 'selected' : el.dataset.featured === 'true' ? 'featured' : 'normal';
      el.setAttribute('aria-pressed', String(id === selectedId));
      if (id === selectedId) el.parentElement?.style.setProperty('z-index', '2');
      else el.parentElement?.style.removeProperty('z-index');
    });
  });

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-sand-200 bg-lapis-50',
        className,
      )}
    >
      <div ref={containerRef} className="size-full" role="region" aria-label={t('region')} />
      {status === 'loading' && (
        <p className="absolute inset-0 grid place-items-center text-sm text-sand-500">
          {t('loading')}
        </p>
      )}
      {status === 'error' && (
        <p className="absolute inset-0 grid place-items-center px-6 text-center text-sm text-sand-700">
          {t('error')}
        </p>
      )}
    </div>
  );
}
