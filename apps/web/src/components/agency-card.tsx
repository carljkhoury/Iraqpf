import type { Locale } from '@mahalla/shared';
import { Badge } from '@mahalla/ui';
import { BadgeCheck, MapPin } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { AgencyCardData } from '@/lib/sample-data';

export function AgencyCard({ agency }: { agency: AgencyCardData }) {
  const t = useTranslations('listing');
  const locale = useLocale() as Locale;

  return (
    <Link
      href={`/agencies/${agency.slug}`}
      className="flex items-center gap-4 rounded-lg border border-sand-200 bg-white p-4 transition-shadow hover:shadow-raised"
    >
      <span
        aria-hidden
        className="grid size-14 shrink-0 place-items-center rounded-md text-xl font-bold text-white"
        style={{ backgroundColor: agency.color }}
      >
        {agency.initial[locale]}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate font-semibold text-sand-900">{agency.name[locale]}</span>
          {agency.verified && (
            <Badge tone="verified" className="shrink-0 px-1.5">
              <BadgeCheck aria-hidden />
              <span className="sr-only">{t('verified')}</span>
            </Badge>
          )}
        </span>
        <span className="mt-0.5 flex items-center gap-1 text-[13px] text-sand-500">
          <MapPin className="size-3.5" aria-hidden />
          {agency.city[locale]} · {t('count', { count: agency.listingCount })}
        </span>
      </span>
    </Link>
  );
}
