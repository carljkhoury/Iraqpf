import type { Locale } from '@mahalla/shared';
import { Button, Container, cn } from '@mahalla/ui';
import { LayoutGrid, List, Map as MapIcon, SearchX } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  type CategoryGroupKey,
  type CategoryKey,
  type PurposeSlug,
  searchPath,
} from '@/lib/catalog';
import { PAGE_SIZE, searchAllListings, searchListings } from '@/lib/listings-repo';
import { zoomFor } from '@/lib/locations';
import type { LocationOption } from '@/lib/locations';
import {
  type SearchState,
  categoryFromSlug,
  locationFromSegments,
  parseFilters,
  searchHref,
} from '@/lib/search-params';
import { alternates } from '@/lib/seo';
import { ListingRow } from '../listing-row';
import { SearchMapView } from '../map/search-map-view';
import { PropertyCard } from '../property-card';
import { Breadcrumbs, type Crumb } from './breadcrumbs';
import { FilterPanel } from './filter-panel';
import { MobileFilters } from './mobile-filters';
import { Pagination } from './pagination';
import { SortSelect } from './sort-select';

export interface SearchRouteProps {
  params: Promise<{ locale: Locale; category: string; location?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function resolve(category: string, segments: string[] | undefined) {
  const categoryKey = categoryFromSlug(category);
  const location = locationFromSegments(segments);
  if (!categoryKey || location === null) notFound();
  return { categoryKey, location };
}

async function pageTitle(
  locale: Locale,
  purpose: PurposeSlug,
  category: CategoryKey | CategoryGroupKey,
  location: LocationOption | undefined,
) {
  const t = await getTranslations({ locale, namespace: 'search' });
  const tc = await getTranslations({ locale, namespace: 'catalog' });
  const tl = await getTranslations({ locale, namespace: 'listing' });
  const place = location
    ? location.parent
      ? `${location.name[locale]}${locale === 'ar' ? '، ' : ', '}${location.parent[locale]}`
      : location.name[locale]
    : t('iraq');
  return t('title', {
    category: tc(`plural.${category}`),
    purpose: tl(`purpose.${purpose === 'buy' ? 'sale' : 'rent'}`),
    location: place,
  });
}

export async function searchMetadata(
  purpose: PurposeSlug,
  props: SearchRouteProps,
): Promise<Metadata> {
  const { locale, category, location: segments } = await props.params;
  const { categoryKey, location } = resolve(category, segments);
  const t = await getTranslations({ locale, namespace: 'search' });
  const title = await pageTitle(locale, purpose, categoryKey, location);
  return {
    title,
    description: t('metaDescription', { title }),
    alternates: alternates(locale, searchPath(purpose, categoryKey, location?.path)),
  };
}

export async function SearchResultsPage({
  purpose,
  ...props
}: SearchRouteProps & { purpose: PurposeSlug }) {
  const { locale, category, location: segments } = await props.params;
  const { categoryKey, location } = resolve(category, segments);
  const filters = parseFilters(await props.searchParams, purpose);
  const query = { purpose, category: categoryKey, location, filters };
  const result = searchListings(query);
  const isMap = filters.view === 'map';

  const t = await getTranslations({ locale, namespace: 'search' });
  const tn = await getTranslations({ locale, namespace: 'nav' });
  const tc = await getTranslations({ locale, namespace: 'catalog' });
  const tl = await getTranslations({ locale, namespace: 'listing' });
  const title = await pageTitle(locale, purpose, categoryKey, location);

  const state: SearchState = {
    purpose,
    category: categoryKey,
    locationPath: location?.path,
    filters,
  };
  const hrefFor = (page: number) => searchHref({ ...state, filters: { ...filters, page } });
  const viewHref = (view: 'grid' | 'list' | 'map') =>
    searchHref({ ...state, filters: { ...filters, view, page: 1 } });

  const crumbs: Crumb[] = [
    { label: t('home'), href: '/' },
    { label: tn(purpose), href: searchPath(purpose, 'properties') },
    {
      label: tc(`plural.${categoryKey}`),
      href: location ? searchPath(purpose, categoryKey) : undefined,
    },
  ];
  if (location?.parent) {
    const parentPath = location.path.split('/').slice(0, -1).join('/');
    crumbs.push({
      label: location.parent[locale],
      href: searchPath(purpose, categoryKey, parentPath),
    });
  }
  if (location) crumbs.push({ label: location.name[locale] });

  const from = result.total === 0 ? 0 : (result.page - 1) * PAGE_SIZE + 1;
  const to = Math.min(result.page * PAGE_SIZE, result.total);

  return (
    <Container className="py-6 sm:py-8">
      <Breadcrumbs items={crumbs} />
      <div className="mt-3 mb-5">
        <h1 className="text-2xl font-bold sm:text-[28px]">{title}</h1>
        <p className="mt-1 text-sm text-sand-500" aria-live="polite">
          {tl('count', { count: result.total })}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-lg border border-sand-200 bg-white px-4 py-3">
            <FilterPanel state={state} location={location ?? null} />
          </div>
        </aside>

        <section aria-label={title} className="min-w-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <MobileFilters state={state} location={location ?? null} total={result.total} />
              {result.total > 0 && !isMap && (
                <p className="hidden text-sm text-sand-500 sm:block">
                  {t('summary', { from, to, total: result.total })}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <SortSelect state={state} />
              <div
                className="flex rounded-md border border-sand-200 bg-white p-0.5"
                role="group"
                aria-label={t('view')}
              >
                {(['grid', 'list', 'map'] as const).map((view) => {
                  const Icon = view === 'grid' ? LayoutGrid : view === 'list' ? List : MapIcon;
                  const active = filters.view === view;
                  return (
                    <Link
                      key={view}
                      href={viewHref(view)}
                      scroll={false}
                      aria-current={active ? 'true' : undefined}
                      aria-label={t(view)}
                      className={cn(
                        'grid size-8 place-items-center rounded-[8px]',
                        view === 'list' && 'max-sm:hidden',
                        active ? 'bg-lapis-50 text-lapis-700' : 'text-sand-500 hover:text-sand-900',
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {isMap ? (
            <SearchMapView
              listings={searchAllListings(query)}
              fallbackCenter={location?.center ?? undefined}
              fallbackZoom={location ? zoomFor(location.type) : undefined}
            />
          ) : result.total === 0 ? (
            <div className="grid place-items-center rounded-lg border border-dashed border-sand-300 bg-white px-6 py-16 text-center">
              <SearchX className="size-10 text-sand-300" aria-hidden />
              <h2 className="mt-4 text-lg font-semibold">{t('emptyTitle')}</h2>
              <p className="mt-1 text-sm text-sand-500">{t('emptyText')}</p>
              <Button asChild variant="secondary" className="mt-5">
                <Link href={searchPath(purpose, categoryKey)}>{t('clearAll')}</Link>
              </Button>
            </div>
          ) : filters.view === 'list' ? (
            <div className="grid gap-4">
              {result.items.map((listing, i) => (
                <ListingRow key={listing.id} listing={listing} priority={i < 2} />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {result.items.map((listing, i) => (
                <PropertyCard key={listing.id} listing={listing} priority={i < 3} />
              ))}
            </div>
          )}

          {!isMap && (
            <Pagination page={result.page} pageCount={result.pageCount} hrefFor={hrefFor} />
          )}
        </section>
      </div>
    </Container>
  );
}
