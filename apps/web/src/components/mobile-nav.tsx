'use client';

import { Button, Logo } from '@mahalla/ui';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { AccountButton } from './account/account-button';
import { LanguageSwitcher } from './language-switcher';
import { NAV_LINKS } from './nav-links';

export function MobileNav() {
  const t = useTranslations('nav');
  const tc = useTranslations('common');
  const locale = useLocale() as 'ar' | 'en';
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="icon" aria-label={tc('menu')} className="lg:hidden">
          <Menu className="size-6" aria-hidden />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-lapis-900/40" />
        <Dialog.Content
          className="fixed inset-y-0 end-0 z-50 flex w-[min(88vw,360px)] flex-col bg-white shadow-overlay"
          aria-describedby={undefined}
        >
          <div className="flex h-16 items-center justify-between border-b border-sand-200 px-4">
            <Dialog.Title className="sr-only">{tc('menu')}</Dialog.Title>
            <Logo locale={locale} />
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label={tc('close')}>
                <X className="size-6" aria-hidden />
              </Button>
            </Dialog.Close>
          </div>
          <nav aria-label={t('mainLabel')} className="flex-1 overflow-y-auto px-2 py-3">
            <ul className="grid gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="flex h-12 items-center rounded-md px-3 text-base font-medium text-sand-900 hover:bg-sand-50"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="grid gap-2 border-t border-sand-200 p-4">
            <Button asChild size="lg">
              <Link href="/list-property" onClick={close}>
                {t('listProperty')}
              </Link>
            </Button>
            <AccountButton className="h-12 border border-lapis-200" onNavigate={close} />
            <LanguageSwitcher className="justify-center" />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
