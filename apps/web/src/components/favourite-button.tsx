'use client';

import { cn } from '@mahalla/ui';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useFavourites } from '@/lib/use-favourites';

export function FavouriteButton({
  listingId,
  className,
}: {
  listingId: number;
  className?: string;
}) {
  const t = useTranslations('listing');
  const { isFavourite, toggle } = useFavourites();
  const active = isFavourite(listingId);

  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={active ? t('removeFavourite') : t('saveFavourite')}
      onClick={(e) => {
        // The card is a link; saving must not navigate.
        e.preventDefault();
        e.stopPropagation();
        toggle(listingId);
      }}
      className={cn(
        'grid size-9 place-items-center rounded-full bg-white/95 text-sand-900 shadow-card transition-colors hover:bg-white',
        className,
      )}
    >
      <Heart
        className={cn('size-[18px]', active && 'fill-danger-600 text-danger-600')}
        aria-hidden
      />
    </button>
  );
}
