import { cn } from '@mahalla/ui';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

/** Page links (crawlable). `hrefFor` builds the URL for a page number. */
export function Pagination({
  page,
  pageCount,
  hrefFor,
}: {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
}) {
  const t = useTranslations('search');
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
  );
  const item =
    'grid h-10 min-w-10 place-items-center rounded-md border px-3 text-sm font-medium transition-colors';

  return (
    <nav aria-label={t('pagination')} className="mt-8 flex justify-center">
      <ul className="flex items-center gap-1.5">
        <li>
          {page > 1 ? (
            <Link
              href={hrefFor(page - 1)}
              rel="prev"
              className={cn(item, 'border-sand-200 bg-white hover:bg-sand-50')}
            >
              {/* Previous points back against the reading direction. */}
              <ChevronRight className="size-4 ltr:-scale-x-100" aria-hidden />
              <span className="sr-only">{t('previous')}</span>
            </Link>
          ) : null}
        </li>
        {pages.map((p, i) => (
          <li key={p} className="flex items-center gap-1.5">
            {i > 0 && p - pages[i - 1]! > 1 && <span className="px-1 text-sand-500">…</span>}
            <Link
              href={hrefFor(p)}
              aria-current={p === page ? 'page' : undefined}
              aria-label={t('pageLabel', { page: p })}
              className={cn(
                item,
                p === page
                  ? 'border-lapis-600 bg-lapis-600 text-white'
                  : 'border-sand-200 bg-white text-sand-700 hover:bg-sand-50',
              )}
            >
              <bdi>{p}</bdi>
            </Link>
          </li>
        ))}
        <li>
          {page < pageCount ? (
            <Link
              href={hrefFor(page + 1)}
              rel="next"
              className={cn(item, 'border-sand-200 bg-white hover:bg-sand-50')}
            >
              <ChevronLeft className="size-4 ltr:-scale-x-100" aria-hidden />
              <span className="sr-only">{t('next')}</span>
            </Link>
          ) : null}
        </li>
      </ul>
    </nav>
  );
}
