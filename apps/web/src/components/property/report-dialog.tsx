'use client';

import { Button } from '@mahalla/ui';
import * as Dialog from '@radix-ui/react-dialog';
import { CircleCheck, Flag, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SAMPLE_MODE } from '@/lib/demo';

const REASONS = ['wrong_price', 'fake', 'sold', 'wrong_location', 'wrong_photos', 'other'] as const;
type Reason = (typeof REASONS)[number];

/** Report form (decision F-06). Reports are stored by the moderation module in Phase 3. */
export function ReportDialog() {
  const t = useTranslations('property');
  const tc = useTranslations('common');
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<Reason | null>(null);
  const [details, setDetails] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setReason(null);
      setDetails('');
      setSent(false);
      setError(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm text-sand-500 hover:text-danger-600"
        >
          <Flag className="size-4" aria-hidden />
          {t('report')}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-lapis-900/40" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-xl bg-white p-6 shadow-overlay sm:start-1/2 sm:top-1/2 sm:bottom-auto sm:w-[460px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:rtl:translate-x-1/2">
          <div className="flex items-start justify-between gap-4">
            <Dialog.Title className="text-lg font-semibold">{t('reportTitle')}</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={tc('close')}
                className="grid size-9 place-items-center rounded-full hover:bg-sand-100"
              >
                <X className="size-5" aria-hidden />
              </button>
            </Dialog.Close>
          </div>
          {sent ? (
            <div className="py-6 text-center">
              <CircleCheck className="mx-auto size-12 text-success-600" aria-hidden />
              <p className="mt-3 font-medium text-sand-900">{t('reportThanks')}</p>
              {SAMPLE_MODE && <p className="mt-1 text-sm text-sand-500">{t('reportSampleNote')}</p>}
              <Dialog.Close asChild>
                <Button className="mt-5">{t('demoOk')}</Button>
              </Dialog.Close>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!reason) {
                  setError(true);
                  return;
                }
                setSent(true);
              }}
            >
              <Dialog.Description className="mt-1 text-sm text-sand-500">
                {t('reportIntro')}
              </Dialog.Description>
              <fieldset className="mt-4 grid gap-2" aria-invalid={error}>
                <legend className="sr-only">{t('reportChooseReason')}</legend>
                {REASONS.map((key) => (
                  <label
                    key={key}
                    className="flex cursor-pointer items-center gap-3 rounded-md border border-sand-200 px-3 py-2.5 text-sm has-[:checked]:border-lapis-600 has-[:checked]:bg-lapis-50"
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={key}
                      checked={reason === key}
                      onChange={() => {
                        setReason(key);
                        setError(false);
                      }}
                      className="size-4 accent-lapis-600"
                    />
                    {t(`reportReasons.${key}`)}
                  </label>
                ))}
              </fieldset>
              {error && <p className="mt-2 text-sm text-danger-600">{t('reportChooseReason')}</p>}
              <label
                htmlFor="report-details"
                className="mt-4 block text-[13px] font-semibold text-sand-900"
              >
                {t('reportDetails')}
              </label>
              <textarea
                id="report-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                maxLength={1000}
                className="mt-1.5 w-full rounded-sm border border-sand-200 px-3 py-2 text-[15px] focus:border-lapis-500 focus:outline-2 focus:outline-lapis-200"
              />
              <Button type="submit" variant="danger" className="mt-4 w-full">
                {t('reportSubmit')}
              </Button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
