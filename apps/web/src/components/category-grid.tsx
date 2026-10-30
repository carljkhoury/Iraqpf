import {
  Briefcase,
  Building2,
  Castle,
  House,
  LandPlot,
  Sprout,
  Store,
  Warehouse,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { type CategoryKey, type PurposeSlug, searchPath } from '@/lib/catalog';

const ITEMS: { key: CategoryKey; purpose: PurposeSlug; Icon: typeof House }[] = [
  { key: 'apartment', purpose: 'buy', Icon: Building2 },
  { key: 'house', purpose: 'buy', Icon: House },
  { key: 'villa', purpose: 'buy', Icon: Castle },
  { key: 'residential_land', purpose: 'buy', Icon: LandPlot },
  { key: 'office', purpose: 'rent', Icon: Briefcase },
  { key: 'shop', purpose: 'rent', Icon: Store },
  { key: 'warehouse', purpose: 'rent', Icon: Warehouse },
  { key: 'farm', purpose: 'buy', Icon: Sprout },
];

export function CategoryGrid() {
  const t = useTranslations('catalog.plural');
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {ITEMS.map(({ key, purpose, Icon }) => (
        <li key={key}>
          <Link
            href={searchPath(purpose, key)}
            className="flex h-full flex-col items-center gap-2.5 rounded-lg border border-sand-200 bg-white px-3 py-4 text-center transition-colors hover:border-lapis-200 hover:bg-lapis-50"
          >
            <span className="grid size-11 place-items-center rounded-full bg-lapis-50 text-lapis-600">
              <Icon className="size-[22px]" aria-hidden />
            </span>
            <span className="text-sm font-medium text-sand-900">
              {t(key as Parameters<typeof t>[0])}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
