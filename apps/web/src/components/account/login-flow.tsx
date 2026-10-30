'use client';

import { formatIraqiPhone, normalizeIraqiMobile, toWesternDigits } from '@mahalla/shared';
import { Button, Field, Input, PhoneInput } from '@mahalla/ui';
import { Info, MessageCircle, Smartphone } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { DEMO_OTP, useDemoSession } from '@/lib/demo-session';
import { SAMPLE_MODE } from '@/lib/demo';

type Step = 'phone' | 'code' | 'name';

/** Only same-site paths are allowed as a post-login destination. */
function safeNext(next: string | null): string {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/account';
}

export function LoginFlow() {
  const t = useTranslations('auth');
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const { signIn } = useDemoSession();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'sms'>('whatsapp');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const e164 = normalizeIraqiMobile(phone);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    if (!e164) {
      setError(t('phoneInvalid'));
      return;
    }
    setError(null);
    setCode('');
    setCooldown(60);
    setStep('code');
  }

  function verify(e: React.FormEvent) {
    e.preventDefault();
    if (toWesternDigits(code).replace(/\D/g, '') !== DEMO_OTP) {
      setError(t('codeInvalid'));
      return;
    }
    setError(null);
    setStep('name');
  }

  function finish(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError(t('nameInvalid'));
      return;
    }
    signIn(e164!, name.trim());
    router.replace(next);
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-sand-200 bg-white p-6 shadow-card sm:p-8">
      {SAMPLE_MODE && (
        <div className="mb-6 flex gap-3 rounded-md bg-gold-50 p-3 text-sm text-gold-700">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>
            <strong className="font-semibold">{t('demoTitle')}: </strong>
            {t('demoText', { code: DEMO_OTP })}
          </p>
        </div>
      )}

      {step === 'phone' && (
        <form onSubmit={sendCode} noValidate>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="mt-2 text-sm text-sand-500">{t('subtitle')}</p>
          <Field
            id="login-phone"
            label={t('phoneLabel')}
            error={error ?? undefined}
            className="mt-6"
          >
            <PhoneInput
              id="login-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0770 123 4567"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'login-phone-error' : undefined}
              autoFocus
            />
          </Field>
          <fieldset className="mt-5">
            <legend className="text-[13px] font-semibold text-sand-900">{t('channel')}</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(['whatsapp', 'sms'] as const).map((c) => {
                const Icon = c === 'whatsapp' ? MessageCircle : Smartphone;
                return (
                  <label
                    key={c}
                    className="flex cursor-pointer items-center gap-2 rounded-md border border-sand-200 px-3 py-2.5 text-sm has-[:checked]:border-lapis-600 has-[:checked]:bg-lapis-50"
                  >
                    <input
                      type="radio"
                      name="channel"
                      value={c}
                      checked={channel === c}
                      onChange={() => setChannel(c)}
                      className="size-4 accent-lapis-600"
                    />
                    <Icon className="size-4 text-sand-500" aria-hidden />
                    {t(c)}
                  </label>
                );
              })}
            </div>
          </fieldset>
          <Button type="submit" size="lg" className="mt-6 w-full">
            {t('continue')}
          </Button>
          <p className="mt-4 text-center text-xs text-sand-500">{t('terms')}</p>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={verify} noValidate>
          <h1 className="text-2xl font-bold">{t('codeTitle')}</h1>
          <p className="mt-2 text-sm text-sand-500">
            {t('codeSent')}{' '}
            <bdi dir="ltr" className="font-semibold text-sand-900">
              {formatIraqiPhone(e164!)}
            </bdi>
          </p>
          <Field id="login-code" label={t('codeLabel')} error={error ?? undefined} className="mt-6">
            <Input
              id="login-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              dir="ltr"
              className="text-center text-2xl tracking-[0.5em] tabular"
              aria-invalid={Boolean(error)}
              autoFocus
            />
          </Field>
          <Button type="submit" size="lg" className="mt-6 w-full">
            {t('verify')}
          </Button>
          <div className="mt-4 flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setError(null);
              }}
              className="font-semibold text-lapis-600 hover:text-lapis-700"
            >
              {t('changeNumber')}
            </button>
            {cooldown > 0 ? (
              <span className="text-sand-500">{t('resendIn', { seconds: cooldown })}</span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  sendCode();
                  setNotice(t('resent'));
                }}
                className="font-semibold text-lapis-600 hover:text-lapis-700"
              >
                {t('resend')}
              </button>
            )}
          </div>
          <p className="sr-only" aria-live="polite">
            {notice}
          </p>
        </form>
      )}

      {step === 'name' && (
        <form onSubmit={finish} noValidate>
          <h1 className="text-2xl font-bold">{t('nameTitle')}</h1>
          <p className="mt-2 text-sm text-sand-500">{t('nameSubtitle')}</p>
          <Field id="login-name" label={t('nameLabel')} error={error ?? undefined} className="mt-6">
            <Input
              id="login-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              maxLength={60}
              aria-invalid={Boolean(error)}
              autoFocus
            />
          </Field>
          <Button type="submit" size="lg" className="mt-6 w-full">
            {t('finish')}
          </Button>
        </form>
      )}
    </div>
  );
}
