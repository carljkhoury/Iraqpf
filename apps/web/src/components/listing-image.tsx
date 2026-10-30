'use client';

import { cn } from '@mahalla/ui';
import { useEffect, useRef, useState } from 'react';

interface ListingImageProps {
  src: string;
  fallback: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

/**
 * Listing photo that swaps to an illustration if the photo fails to load.
 * Also catches failures that happen before hydration (img.complete with no size).
 */
export function ListingImage({
  src,
  fallback,
  alt,
  className,
  priority = false,
}: ListingImageProps) {
  const [current, setCurrent] = useState(src);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setCurrent(fallback);
  }, [fallback]);

  return (
    // eslint-disable-next-line @next/next/no-img-element -- remote sample photos, resized by the CDN
    <img
      ref={ref}
      src={current}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => setCurrent(fallback)}
      className={cn('absolute inset-0 size-full object-cover', className)}
    />
  );
}
