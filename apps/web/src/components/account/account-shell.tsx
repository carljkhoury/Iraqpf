'use client';

import { formatIraqiPhone } from '@mahalla/shared';
import { Button, cn } from '@mahalla/ui';
import {
  Building2,
  Heart,
  History,
  Info,
  LayoutDashboard,
  LogOut,
  Plus,
  Settings,
  UserRound,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { SAMPLE_MODE } from '@/lib/demo';
import { useDemoSession } from '@/lib/demo-session';

const NAV = [
  { key: 'overview', href: '/account', icon: LayoutDashboard },
  { key: 'listings', href: '/account/listings', icon: Building2 },
  { key: 'favourites', href: '/account/favourites', icon: Heart },
  { key: 'recent', href: '/account/recent', icon: History },
  { key: 'settings', href: '/account/settings', icon: Settings },
] as const;

/** Account layout: requires sign-in, then shows navigation around the page. */
export function AccountShell({ children }: { children: ReactNode }) {
  const t = useTranslations('account');
  const ta = useTranslations('auth');
  const { user, signOut } = useDemoSession();
  const pathname = usePathname();
  const router = useRouter();

  if (user === undefined) {
    return <div className="h-96 animate-pulse rounded-xl bg-sand-100" aria-busy="true" />;
  }

  if (!user) {
    return (
      <div className="mx-auto grid max-w-md place-items-center rounded-xl border border-sand-200 bg-white p-8 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-lapis-50 text-lapis-600">
          <UserRound className="size-7" aria-hidden />
        </span>
        <h1 className="mt-4 text-xl font-bold">{ta('signInRequired')}</h1>
        <p className="mt-2 text-sm text-sand-500">{ta('signInRequiredText')}</p>
        <Button asChild className="mt-6">
          <Link href={`/login?next=${encodeURIComponent(pathname)}`}>{ta('signIn')}</Link>
        </Button>
      </div>
    );
  }

  const isActive = (href: string) =>
    href === '/account' ? pathname === href : pathname.startsWith(href);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="min-w-0 lg:sticky lg:top-20 lg:self-start">
        <div className="hidden items-center gap-3 px-2 pb-4 lg:flex">
          <span
            className="grid size-10 place-items-center rounded-full bg-lapis-600 font-bold text-white"
            aria-hidden
          >
            {user.name[0]}
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-sand-900">{user.name}</p>
            <bdi dir="ltr" className="text-xs text-sand-500">
              {formatIraqiPhone(user.phone)}
            </bdi>
          </div>
        </div>
        <nav aria-label={t('nav.label')}>
          <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:px-0">
            {NAV.map(({ key, href, icon: Icon }) => (
              <li key={key} className="shrink-0">
                <Link
                  href={href}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className={cn(
                    'flex h-10 items-center gap-2.5 rounded-md px-3 text-sm font-medium whitespace-nowrap transition-colors',
                    isActive(href)
                      ? 'bg-lapis-50 text-lapis-700'
                      : 'text-sand-700 hover:bg-sand-100 hover:text-sand-900',
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {t(`nav.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-4 hidden gap-2 lg:grid">
          <Button asChild>
            <Link href="/list-property">
              <Plus className="size-4" aria-hidden />
              {t('listProperty')}
            </Link>
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              signOut();
              router.push('/');
            }}
          >
            <LogOut className="size-4" aria-hidden />
            {ta('signOut')}
          </Button>
        </div>
      </aside>
      <div className="min-w-0">
        {SAMPLE_MODE && (
          <p className="mb-5 flex items-start gap-2 rounded-md bg-gold-50 px-3 py-2 text-xs text-gold-700">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {t('demoNotice')}
          </p>
        )}
        {children}
        <Button
          variant="ghost"
          className="mt-8 lg:hidden"
          onClick={() => {
            signOut();
            router.push('/');
          }}
        >
          <LogOut className="size-4" aria-hidden />
          {ta('signOut')}
        </Button>
      </div>
    </div>
  );
}
