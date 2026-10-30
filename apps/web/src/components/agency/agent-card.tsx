'use client';

import type { Locale } from '@mahalla/shared';
import { Languages } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { AgentData } from '@/lib/sample-data';
import { ContactButtons } from '../property/contact';

export function AgentCard({
  agent,
  listingCount,
  pageUrl,
}: {
  agent: AgentData;
  listingCount: number;
  pageUrl: string;
}) {
  const t = useTranslations('agencies');
  const tl = useTranslations('listing');
  const locale = useLocale() as Locale;
  return (
    <article className="flex flex-col rounded-lg border border-sand-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid size-12 shrink-0 place-items-center rounded-full bg-lapis-100 text-lg font-bold text-lapis-700"
        >
          {agent.initial[locale]}
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{agent.name[locale]}</h3>
          <p className="text-sm text-sand-500">{agent.title[locale]}</p>
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-sand-500">
        <Languages className="size-3.5" aria-hidden />
        <span className="sr-only">{t('languages')}: </span>
        {agent.languages.map((l) => t(`languageNames.${l}`)).join(locale === 'ar' ? '، ' : ', ')}
      </p>
      <p className="mt-1 text-xs text-sand-500">{tl('count', { count: listingCount })}</p>
      <ContactButtons
        phone={agent.phone}
        message={t('agentWhatsappMessage', { name: agent.name[locale], url: pageUrl })}
        size="sm"
        className="mt-4"
      />
    </article>
  );
}
