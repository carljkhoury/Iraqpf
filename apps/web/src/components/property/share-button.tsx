'use client';

import { Button } from '@mahalla/ui';
import { Check, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

/** Native share sheet on phones (WhatsApp, Telegram…); copies the link elsewhere. */
export function ShareButton({ title, url }: { title: string; url: string }) {
  const t = useTranslations('property');
  const [copied, setCopied] = useState(false);

  async function share() {
    const text = t('shareText', { title });
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: text, url });
        return;
      } catch (error) {
        if ((error as Error).name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt(text, url);
    }
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={share}>
        {copied ? (
          <Check className="size-4" aria-hidden />
        ) : (
          <Share2 className="size-4" aria-hidden />
        )}
        {copied ? t('shareCopied') : t('share')}
      </Button>
      <span className="sr-only" aria-live="polite">
        {copied ? t('shareCopied') : ''}
      </span>
    </>
  );
}
