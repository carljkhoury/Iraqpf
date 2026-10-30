'use client';

import { formatIraqiPhone, normalizeIraqiMobile } from '@mahalla/shared';
import { Badge, Button, Field, Input, PhoneInput } from '@mahalla/ui';
import * as Dialog from '@radix-ui/react-dialog';
import { BadgeCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type ReactNode, useState } from 'react';
import { Link, useRouter } from '@/i18n/navigation';
import { type AccountType, type DemoUser, useDemoSession } from '@/lib/demo-session';
import { LanguageSwitcher } from '../language-switcher';

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-sand-200 bg-white p-5">
      <h2 className="mb-4 text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SettingsForm() {
  const t = useTranslations('account');
  const ta = useTranslations('auth');
  const router = useRouter();
  const { user, update, signOut } = useDemoSession();
  const [edits, setEdits] = useState<Partial<DemoUser>>({});
  const [errors, setErrors] = useState<{ name?: string; email?: string; whatsapp?: string }>({});
  const [saved, setSaved] = useState(false);

  if (!user) return null;
  const draft: DemoUser = { ...user, ...edits };

  function save(e: React.FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (draft.name.trim().length < 2) next.name = ta('nameInvalid');
    if (draft.email && !EMAIL.test(draft.email)) next.email = t('emailInvalid');
    if (draft.whatsapp && !normalizeIraqiMobile(draft.whatsapp)) next.whatsapp = ta('phoneInvalid');
    setErrors(next);
    if (Object.keys(next).length) return;
    update({
      ...draft,
      name: draft.name.trim(),
      whatsapp: draft.whatsapp ? normalizeIraqiMobile(draft.whatsapp)! : undefined,
    });
    setEdits({});
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const set = <K extends keyof DemoUser>(key: K, value: DemoUser[K]) =>
    setEdits((e) => ({ ...e, [key]: value }));

  return (
    <form onSubmit={save} noValidate className="grid gap-5">
      <h1 className="text-2xl font-bold">{t('settingsTitle')}</h1>

      <Card title={t('profile')}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="set-name" label={t('name')} error={errors.name}>
            <Input
              id="set-name"
              value={draft.name}
              onChange={(e) => set('name', e.target.value)}
              maxLength={60}
            />
          </Field>
          <div className="grid gap-1.5">
            <span className="text-[13px] font-semibold text-sand-900">{t('phone')}</span>
            <div className="flex h-11 items-center justify-between rounded-sm border border-sand-200 bg-sand-50 px-3">
              <bdi dir="ltr" className="tabular">
                {formatIraqiPhone(draft.phone)}
              </bdi>
              <Badge tone="verified">
                <BadgeCheck aria-hidden />
                {t('phoneVerified')}
              </Badge>
            </div>
            <p className="text-xs text-sand-500">{t('phoneChangeHelp')}</p>
          </div>
          <Field id="set-email" label={t('email')} error={errors.email}>
            <Input
              id="set-email"
              type="email"
              dir="ltr"
              value={draft.email ?? ''}
              onChange={(e) => set('email', e.target.value || undefined)}
            />
          </Field>
          <Field id="set-wa" label={t('whatsappNumber')} error={errors.whatsapp}>
            <PhoneInput
              id="set-wa"
              value={draft.whatsapp ? formatIraqiPhone(draft.whatsapp) : ''}
              onChange={(e) => set('whatsapp', e.target.value || undefined)}
              placeholder="0750 123 4567"
            />
          </Field>
        </div>
      </Card>

      <Card title={t('accountType')}>
        <div className="grid gap-2">
          {(['seeker', 'owner', 'broker'] as AccountType[]).map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-start gap-3 rounded-md border border-sand-200 p-3 has-[:checked]:border-lapis-600 has-[:checked]:bg-lapis-50"
            >
              <input
                type="radio"
                name="accountType"
                checked={draft.accountType === type}
                onChange={() => set('accountType', type)}
                className="mt-1 size-4 accent-lapis-600"
              />
              <span>
                <span className="block text-sm font-semibold text-sand-900">
                  {t(`accountTypes.${type}`)}
                </span>
                <span className="block text-xs text-sand-500">{t(`accountTypeHelp.${type}`)}</span>
              </span>
            </label>
          ))}
        </div>
        <p className="mt-3 text-sm text-sand-500">
          {t('agencyNote')}{' '}
          <Link
            href="/agencies/register"
            className="font-semibold text-lapis-600 hover:text-lapis-700"
          >
            {t('agencyLink')}
          </Link>
        </p>
      </Card>

      <Card title={t('notificationsTitle')}>
        <div className="grid gap-3">
          {(['messages', 'listingUpdates', 'newsletter'] as const).map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center justify-between gap-4 text-sm"
            >
              <span>{t(`notifications.${key}`)}</span>
              <input
                type="checkbox"
                role="switch"
                checked={draft.notifications[key]}
                onChange={(e) =>
                  set('notifications', { ...draft.notifications, [key]: e.target.checked })
                }
                className="size-5 accent-lapis-600"
              />
            </label>
          ))}
        </div>
      </Card>

      <Card title={t('languageTitle')}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-sand-500">{t('languageHelp')}</p>
          <LanguageSwitcher className="border border-sand-200" />
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg">
          {t('save')}
        </Button>
        <span role="status" className="text-sm text-success-600">
          {saved ? t('saved') : ''}
        </span>
      </div>

      <section className="rounded-lg border border-danger-600/30 bg-white p-5">
        <h2 className="text-base font-semibold text-danger-600">{t('dangerTitle')}</h2>
        <p className="mt-1 text-sm text-sand-500">{t('dangerText')}</p>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button variant="danger" className="mt-4">
              {t('deleteAccount')}
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-lapis-900/40" />
            <Dialog.Content className="fixed start-1/2 top-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-overlay rtl:translate-x-1/2">
              <Dialog.Title className="text-lg font-semibold">
                {t('deleteAccountTitle')}
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-sand-700">
                {t('deleteAccountText')}
              </Dialog.Description>
              <div className="mt-6 flex justify-end gap-2">
                <Dialog.Close asChild>
                  <Button variant="secondary">{t('cancel')}</Button>
                </Dialog.Close>
                <Button
                  variant="danger"
                  onClick={() => {
                    try {
                      for (const key of [
                        'mahalla:favourites',
                        'mahalla:recently-viewed',
                        'mahalla:demo-my-listings',
                      ])
                        window.localStorage.removeItem(key);
                    } catch {
                      // Nothing stored.
                    }
                    signOut();
                    router.push('/');
                  }}
                >
                  {t('deleteConfirm')}
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </section>
    </form>
  );
}
