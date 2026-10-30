'use client';

import { cn } from '@mahalla/ui';
import { Globe } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Link, usePathname } from '@/i18n/navigation';

/**
 * Links to the same page in the other language. A real link (not a button)
 * so it works without JavaScript and search engines can follow it.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations('language');
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const other = locale === 'ar' ? 'en' : 'ar';
  const query = Object.fromEntries(searchParams.entries());

  return (
    <Link
      href={{ pathname, query }}
      locale={other}
      hrefLang={other}
      aria-label={t('switchLabel')}
      className={cn(
        'inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-sand-700 hover:bg-sand-100 hover:text-sand-900',
        className,
      )}
    >
      <Globe className="size-4 text-sand-500" aria-hidden />
      <span lang={other} className={other === 'ar' ? 'font-arabic' : 'font-latin'}>
        {t('switchTo')}
      </span>
    </Link>
  );
}
