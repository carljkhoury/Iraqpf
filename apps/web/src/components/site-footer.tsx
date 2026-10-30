import type { Locale } from '@mahalla/shared';
import { Container, Logo } from '@mahalla/ui';
import { useLocale, useTranslations } from 'next-intl';
import { Suspense } from 'react';
import { Link } from '@/i18n/navigation';
import { searchPath } from '@/lib/catalog';
import { SAMPLE_POPULAR_AREAS } from '@/lib/sample-data';
import { LanguageSwitcher } from './language-switcher';
import { NAV_LINKS } from './nav-links';

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-sand-900">{title}</h2>
      <ul className="mt-3 grid gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-sand-500 hover:text-lapis-700">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');
  const th = useTranslations('home');
  const locale = useLocale() as Locale;

  return (
    <footer className="border-t border-sand-200 bg-sand-50">
      <Container className="grid gap-10 py-12 md:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
        <div className="max-w-sm">
          <Logo locale={locale} />
          <p className="mt-3 text-sm font-medium text-gold-700">{t('tagline')}</p>
          <p className="mt-2 text-sm text-sand-500">{t('about')}</p>
        </div>
        <FooterColumn
          title={t('searchTitle')}
          links={NAV_LINKS.map((link) => ({ href: link.href, label: tn(link.key) }))}
        />
        <FooterColumn
          title={t('areasTitle')}
          links={SAMPLE_POPULAR_AREAS.slice(0, 5).map((area) => ({
            href: searchPath('buy', 'properties', area.path),
            label: area.name[locale],
          }))}
        />
        <FooterColumn
          title={t('advertisersTitle')}
          links={[
            { href: '/list-property', label: tn('listProperty') },
            { href: '/agencies/register', label: th('ctaAgency') },
            { href: '/login', label: tn('login') },
            { href: '/help', label: t('help') },
          ]}
        />
      </Container>
      <div className="border-t border-sand-200">
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-sm text-sand-500 sm:flex-row">
          <p>{t('rights', { year: new Date().getFullYear() })}</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <li>
              <Link href="/about" className="hover:text-lapis-700">
                {t('aboutUs')}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-lapis-700">
                {t('terms')}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-lapis-700">
                {t('privacy')}
              </Link>
            </li>
            <li>
              <Suspense>
                <LanguageSwitcher className="h-8 px-2" />
              </Suspense>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
