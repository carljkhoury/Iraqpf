import { ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';
import { Link } from '@/i18n/navigation';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = useTranslations('search');
  return (
    <nav aria-label={t('breadcrumb')}>
      <ol className="flex flex-wrap items-center gap-1 text-[13px] text-sand-500">
        {items.map((item, i) => (
          <Fragment key={`${item.label}-${i}`}>
            {i > 0 && (
              <li aria-hidden>
                <ChevronLeft className="size-3.5 ltr:-scale-x-100" />
              </li>
            )}
            <li>
              {item.href ? (
                <Link href={item.href} className="hover:text-lapis-700">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-sand-700">
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
