import type { Locale } from '@mahalla/shared';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { searchPath } from '@/lib/catalog';
import type { PopularArea } from '@/lib/sample-data';

/**
 * Area tile. Uses a brick pattern (a nod to the Ishtar Gate) until we have
 * real neighbourhood photography.
 */
export function LocationTile({ area, index }: { area: PopularArea; index: number }) {
  const t = useTranslations('listing');
  const locale = useLocale() as Locale;
  const shades = ['bg-lapis-700', 'bg-lapis-800', 'bg-lapis-600', 'bg-lapis-900'];

  return (
    <Link
      href={searchPath('buy', 'properties', area.path)}
      className={`group relative flex min-h-32 flex-col justify-end overflow-hidden rounded-lg p-4 text-white ${shades[index % shades.length]}`}
    >
      <span
        aria-hidden
        className="absolute inset-0 opacity-[0.14] transition-opacity group-hover:opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '100% 14px, 28px 28px, 28px 28px',
          backgroundPosition: '0 0, 0 0, 14px 14px',
        }}
      />
      <span aria-hidden className="absolute start-4 top-4 h-1 w-8 rounded-full bg-gold-500" />
      <span className="relative text-lg font-semibold text-white">{area.name[locale]}</span>
      <span className="relative text-[13px] text-lapis-100">
        {area.city[locale]} · {t('count', { count: area.listingCount })}
      </span>
    </Link>
  );
}
