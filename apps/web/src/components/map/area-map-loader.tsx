'use client';

import dynamic from 'next/dynamic';

/** Client-only wrapper so the map library stays out of the server render. */
export const AreaMapLoader = dynamic(() => import('./area-map').then((m) => m.AreaMap), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-lg bg-lapis-50 sm:h-80" />,
});
