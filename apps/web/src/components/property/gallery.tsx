'use client';

import { Button, cn } from '@mahalla/ui';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useRef, useState } from 'react';
import { photoUrl } from '@/lib/sample-data';
import { ListingImage } from '../listing-image';

interface GalleryProps {
  photos: string[];
  fallback: string;
  alt: string;
}

export function Gallery({ photos, fallback, alt }: GalleryProps) {
  const t = useTranslations('property');
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [stripIndex, setStripIndex] = useState(0);
  const total = photos.length;

  const show = (i: number) => {
    setIndex(i);
    setOpen(true);
  };
  const photoAlt = (i: number) => `${alt} - ${t('photoOf', { index: i + 1, total })}`;

  return (
    <>
      {/* Phones: swipeable strip */}
      <div className="relative -mx-4 sm:mx-0 md:hidden">
        <div
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] sm:rounded-lg"
          onScroll={(e) => {
            const el = e.currentTarget;
            setStripIndex(Math.round(Math.abs(el.scrollLeft) / el.clientWidth));
          }}
        >
          {photos.map((id, i) => (
            <button
              key={`${id}-${i}`}
              type="button"
              onClick={() => show(i)}
              className="relative aspect-[4/3] w-full shrink-0 snap-center bg-sand-100"
              aria-label={photoAlt(i)}
            >
              <ListingImage src={photoUrl(id, 900)} fallback={fallback} alt="" priority={i === 0} />
            </button>
          ))}
        </div>
        <span className="pointer-events-none absolute end-3 bottom-3 rounded-sm bg-lapis-900/75 px-2 py-0.5 text-xs text-white">
          <bdi className="tabular">
            {stripIndex + 1} / {total}
          </bdi>
        </span>
      </div>

      {/* Tablet and desktop: main photo + side photos */}
      <div className="relative hidden md:block">
        <div
          className={cn(
            'grid h-[440px] gap-2 overflow-hidden rounded-xl',
            total >= 3 ? 'grid-cols-4 grid-rows-2' : total === 2 ? 'grid-cols-4' : 'grid-cols-1',
          )}
        >
          {photos.slice(0, 3).map((id, i) => (
            <button
              key={`${id}-${i}`}
              type="button"
              onClick={() => show(i)}
              aria-label={photoAlt(i)}
              className={cn(
                'group relative overflow-hidden bg-sand-100',
                i === 0 && total >= 3 && 'col-span-3 row-span-2',
                i === 0 && total === 2 && 'col-span-3',
              )}
            >
              <ListingImage
                src={photoUrl(id, i === 0 ? 1600 : 800)}
                fallback={fallback}
                alt=""
                priority={i === 0}
                className="transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </button>
          ))}
        </div>
        <Button
          variant="inverse"
          size="sm"
          onClick={() => show(0)}
          className="absolute end-3 bottom-3 shadow-raised"
        >
          <Images className="size-4" aria-hidden />
          {t('showAllPhotos', { count: total })}
        </Button>
      </div>

      <Lightbox
        open={open}
        onOpenChange={setOpen}
        photos={photos}
        fallback={fallback}
        index={index}
        setIndex={setIndex}
        photoAlt={photoAlt}
      />
    </>
  );
}

function Lightbox({
  open,
  onOpenChange,
  photos,
  fallback,
  index,
  setIndex,
  photoAlt,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  photos: string[];
  fallback: string;
  index: number;
  setIndex: (i: number) => void;
  photoAlt: (i: number) => string;
}) {
  const t = useTranslations('property');
  const tc = useTranslations('common');
  const rtl = useLocale() === 'ar';
  const total = photos.length;
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) => setIndex((index + delta + total) % total),
    [index, total, setIndex],
  );

  // In Arabic the "next" photo is to the left, so arrow keys follow the reading direction.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(rtl ? 1 : -1);
    if (e.key === 'ArrowRight') go(rtl ? -1 : 1);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-lapis-900" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex flex-col text-white focus:outline-none"
          onKeyDown={onKeyDown}
          aria-describedby={undefined}
        >
          <div className="flex h-14 shrink-0 items-center justify-between px-4">
            <Dialog.Title className="text-sm">
              {t('gallery')} ·{' '}
              <bdi className="tabular">
                {index + 1} / {total}
              </bdi>
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={tc('close')}
                className="grid size-10 place-items-center rounded-full hover:bg-white/10"
              >
                <X className="size-6" aria-hidden />
              </button>
            </Dialog.Close>
          </div>

          <div
            className="relative min-h-0 flex-1"
            onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
              if (Math.abs(dx) > 40) go(dx < 0 !== rtl ? 1 : -1);
              touchX.current = null;
            }}
          >
            <ListingImage
              key={photos[index]}
              src={photoUrl(photos[index]!, 1600)}
              fallback={fallback}
              alt={photoAlt(index)}
              priority
              className="object-contain"
            />
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label={t('previousPhoto')}
                  className="absolute start-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 hover:bg-white/25"
                >
                  <ChevronRight className="size-6 ltr:-scale-x-100" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label={t('nextPhoto')}
                  className="absolute end-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 hover:bg-white/25"
                >
                  <ChevronLeft className="size-6 ltr:-scale-x-100" aria-hidden />
                </button>
              </>
            )}
          </div>

          <div className="flex shrink-0 justify-center gap-2 overflow-x-auto p-3">
            {photos.map((id, i) => (
              <button
                key={`${id}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={photoAlt(i)}
                aria-current={i === index ? 'true' : undefined}
                className={cn(
                  'relative h-14 w-20 shrink-0 overflow-hidden rounded-sm',
                  i === index ? 'ring-2 ring-gold-500' : 'opacity-60 hover:opacity-100',
                )}
              >
                <ListingImage src={photoUrl(id, 200)} fallback={fallback} alt="" />
              </button>
            ))}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
