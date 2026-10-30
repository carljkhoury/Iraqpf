import type { Locale } from '@mahalla/shared';
import { Badge } from '@mahalla/ui';
import { BadgeCheck, MapPin, Users } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { AgencyProfile } from '@/lib/sample-data';
import { AgencyLogo } from './agency-logo';

export function DirectoryCard({
  agency,
  sale,
  rent,
}: {
  agency: AgencyProfile;
  sale: number;
  rent: number;
}) {
  const t = useTranslations('agencies');
  const locale = useLocale() as Locale;
  return (
    <article className="relative flex flex-col rounded-lg border border-sand-200 bg-white p-5 shadow-card transition-shadow hover:shadow-raised">
      <div className="flex items-start gap-4">
        <AgencyLogo
          initial={agency.initial[locale]}
          color={agency.color}
          className="size-16 text-2xl"
        />
        <div className="min-w-0">
          <h2 className="text-base font-semibold">
            <Link
              href={`/agencies/${agency.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {agency.name[locale]}
            </Link>
          </h2>
          {agency.verified && (
            <Badge tone="verified" className="mt-1">
              <BadgeCheck aria-hidden />
              {t('verifiedAgency')}
            </Badge>
          )}
          <p className="mt-1.5 flex items-center gap-1 text-sm text-sand-500">
            <MapPin className="size-3.5" aria-hidden />
            {agency.city[locale]}
          </p>
        </div>
      </div>
      <p className="mt-4 line-clamp-2 text-sm text-sand-700">{agency.about[locale]}</p>
      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-sand-100 pt-4 text-center">
        <div>
          <dt className="text-xs text-sand-500">{t('stats.sale')}</dt>
          <dd className="font-semibold text-sand-900">
            <bdi>{sale}</bdi>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-sand-500">{t('stats.rent')}</dt>
          <dd className="font-semibold text-sand-900">
            <bdi>{rent}</bdi>
          </dd>
        </div>
        <div>
          <dt className="text-xs text-sand-500">{t('stats.agents')}</dt>
          <dd className="flex items-center justify-center gap-1 font-semibold text-sand-900">
            <Users className="size-3.5 text-sand-500" aria-hidden />
            <bdi>{agency.agents.length}</bdi>
          </dd>
        </div>
      </dl>
    </article>
  );
}
