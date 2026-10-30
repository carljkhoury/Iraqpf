import { Button, Container, Logo } from '@mahalla/ui';
import { Plus } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Suspense } from 'react';
import { Link } from '@/i18n/navigation';
import { AccountButton } from './account/account-button';
import { LanguageSwitcher } from './language-switcher';
import { MobileNav } from './mobile-nav';
import { NAV_LINKS } from './nav-links';

export function SiteHeader() {
  const t = useTranslations('nav');
  const tm = useTranslations('metadata');
  const locale = useLocale() as 'ar' | 'en';

  return (
    <header className="sticky top-0 z-30 border-b border-sand-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <Container className="flex h-16 items-center gap-6">
        <Link href="/" aria-label={tm('siteName')} className="shrink-0">
          <Logo locale={locale} />
        </Link>

        <nav aria-label={t('mainLabel')} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className="inline-flex h-10 items-center rounded-md px-3 text-[15px] font-medium text-sand-700 hover:bg-sand-50 hover:text-sand-900"
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ms-auto flex items-center gap-1 sm:gap-2">
          <Suspense>
            <LanguageSwitcher className="hidden sm:inline-flex" />
          </Suspense>
          <AccountButton className="hidden lg:inline-flex" />
          <Button asChild size="sm" className="sm:h-11 sm:px-4">
            <Link href="/list-property">
              <Plus className="size-4" aria-hidden />
              <span className="hidden sm:inline">{t('listProperty')}</span>
              <span className="sr-only sm:hidden">{t('listProperty')}</span>
            </Link>
          </Button>
          <Suspense>
            <MobileNav />
          </Suspense>
        </div>
      </Container>
    </header>
  );
}
