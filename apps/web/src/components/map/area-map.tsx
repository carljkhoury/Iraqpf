'use client';

import 'maplibre-gl/dist/maplibre-gl.css';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { createMap } from './create-map';

/** Polygon approximating a circle of `radius` metres around a point. */
function circle(lng: number, lat: number, radius: number, steps = 64): number[][] {
  const coords: number[][] = [];
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * 2 * Math.PI;
    const dLat = (radius * Math.sin(angle)) / 111_320;
    const dLng = (radius * Math.cos(angle)) / (111_320 * Math.cos((lat * Math.PI) / 180));
    coords.push([lng + dLng, lat + dLat]);
  }
  return coords;
}

/**
 * Shows the approximate area of a property as a shaded circle, never an exact
 * pin (decision E-09). Loads only when scrolled into view, to save mobile data.
 */
export function AreaMap({ lat, lng, radius = 600 }: { lat: number; lng: number; radius?: number }) {
  const t = useTranslations('map');
  const locale = useLocale() as 'ar' | 'en';
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || !ref.current) return;
    let removed = false;
    let cleanup = () => {};
    createMap(ref.current, locale, { center: [lng, lat], zoom: 13.5, cooperativeGestures: true })
      .then(({ map }) => {
        if (removed) return map.remove();
        cleanup = () => map.remove();
        map.on('load', () => {
          map.addSource('area', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: { type: 'Polygon', coordinates: [circle(lng, lat, radius)] },
            },
          });
          map.addLayer({
            id: 'area-fill',
            type: 'fill',
            source: 'area',
            paint: { 'fill-color': '#22489A', 'fill-opacity': 0.15 },
          });
          map.addLayer({
            id: 'area-line',
            type: 'line',
            source: 'area',
            paint: { 'line-color': '#22489A', 'line-width': 2 },
          });
          setStatus('ready');
        });
      })
      .catch(() => setStatus('error'));
    return () => {
      removed = true;
      cleanup();
    };
  }, [visible, lat, lng, radius, locale]);

  return (
    <div className="relative h-64 overflow-hidden rounded-lg border border-sand-200 bg-lapis-50 sm:h-80">
      <div ref={ref} className="size-full" role="region" aria-label={t('areaLabel')} />
      {status !== 'ready' && (
        <p className="pointer-events-none absolute inset-0 grid place-items-center px-6 text-center text-sm text-sand-500">
          {status === 'error' ? t('error') : t('loading')}
        </p>
      )}
    </div>
  );
}
