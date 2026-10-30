'use client';

import { formatIraqiPhone, type Locale, whatsappLink } from '@mahalla/shared';
import { Badge, Button, cn } from '@mahalla/ui';
import * as Dialog from '@radix-ui/react-dialog';
import { BadgeCheck, Info, MessageCircle, Phone } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { SAMPLE_MODE } from '@/lib/demo';
import type { ListingCardData } from '@/lib/sample-data';

type DemoAction = 'call' | 'whatsapp' | null;

/**
 * Contact actions for a listing. Number reveal, tel: and wa.me links are real;
 * while SAMPLE_MODE is on, calls and chats show an explanation instead of
 * contacting the sample numbers. Lead tracking is added in Phase 3.
 */
function useContact(phone: string, message: string) {
  const [revealed, setRevealed] = useState(false);
  const [demo, setDemo] = useState<DemoAction>(null);
  return {
    revealed,
    reveal: () => setRevealed(true),
    display: formatIraqiPhone(phone),
    telHref: `tel:${phone}`,
    waHref: whatsappLink(phone, message) ?? '#',
    demo,
    setDemo,
  };
}

function DemoDialog({ action, onClose }: { action: DemoAction; onClose: () => void }) {
  const t = useTranslations('property');
  return (
    <Dialog.Root open={action !== null} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-lapis-900/40" />
        <Dialog.Content className="fixed start-1/2 top-1/2 z-50 w-[min(92vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-overlay rtl:translate-x-1/2">
          <span className="grid size-11 place-items-center rounded-full bg-gold-100 text-gold-700">
            <Info className="size-5" aria-hidden />
          </span>
          <Dialog.Title className="mt-4 text-lg font-semibold">{t('demoTitle')}</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-sand-700">
            {action === 'whatsapp' ? t('demoWhatsapp') : t('demoCall')}
          </Dialog.Description>
          <p className="mt-2 text-sm text-sand-500">{t('demoNote')}</p>
          <Dialog.Close asChild>
            <Button className="mt-5 w-full">{t('demoOk')}</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CallButton({
  contact,
  className,
  compact = false,
  size = 'lg',
}: {
  contact: ReturnType<typeof useContact>;
  className?: string;
  compact?: boolean;
  size?: 'sm' | 'lg';
}) {
  const t = useTranslations('property');
  if (!contact.revealed && !compact) {
    return (
      <Button variant="secondary" size={size} className={className} onClick={contact.reveal}>
        <Phone className="size-5" aria-hidden />
        {t('showNumber')}
      </Button>
    );
  }
  const content = (
    <>
      <Phone className="size-5" aria-hidden />
      {contact.revealed ? (
        <bdi dir="ltr" className="tabular">
          {contact.display}
        </bdi>
      ) : (
        t('call')
      )}
    </>
  );
  if (SAMPLE_MODE) {
    return (
      <Button
        size={size}
        className={className}
        onClick={() => {
          contact.reveal();
          contact.setDemo('call');
        }}
      >
        {content}
      </Button>
    );
  }
  return (
    <Button asChild size={size} className={className}>
      <a href={contact.telHref} onClick={contact.reveal}>
        {content}
      </a>
    </Button>
  );
}

function WhatsAppButton({
  contact,
  className,
  size = 'lg',
}: {
  contact: ReturnType<typeof useContact>;
  className?: string;
  size?: 'sm' | 'lg';
}) {
  const t = useTranslations('property');
  const content = (
    <>
      <MessageCircle className="size-5" aria-hidden />
      {t('whatsapp')}
    </>
  );
  if (SAMPLE_MODE) {
    return (
      <Button
        variant="whatsapp"
        size={size}
        className={className}
        onClick={() => contact.setDemo('whatsapp')}
      >
        {content}
      </Button>
    );
  }
  return (
    <Button asChild variant="whatsapp" size={size} className={className}>
      <a href={contact.waHref} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    </Button>
  );
}

/** Show number / call + WhatsApp for any advertiser, agency or agent. */
export function ContactButtons({
  phone,
  message,
  size = 'lg',
  className,
}: {
  phone: string;
  message: string;
  size?: 'sm' | 'lg';
  className?: string;
}) {
  const contact = useContact(phone, message);
  return (
    <div className={cn('grid gap-2', size === 'sm' && 'grid-cols-2', className)}>
      <CallButton contact={contact} className="w-full" compact={size === 'sm'} size={size} />
      <WhatsAppButton contact={contact} className="w-full" size={size} />
      <DemoDialog action={contact.demo} onClose={() => contact.setDemo(null)} />
    </div>
  );
}

export function ContactCard({ listing, pageUrl }: { listing: ListingCardData; pageUrl: string }) {
  const t = useTranslations('property');
  const tl = useTranslations('listing');
  const locale = useLocale() as Locale;
  const { advertiser } = listing;

  return (
    <div className="rounded-xl border border-sand-200 bg-white p-5 shadow-card">
      <h2 className="text-base font-semibold">{t('contactTitle')}</h2>
      <div className="mt-4 flex items-center gap-3">
        <span
          aria-hidden
          className="grid size-14 shrink-0 place-items-center rounded-md bg-lapis-100 text-xl font-bold text-lapis-700"
        >
          {advertiser.initial[locale]}
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-semibold text-sand-900">
            <span className="truncate">{advertiser.name[locale]}</span>
            {listing.verified && (
              <Badge tone="verified" className="shrink-0 px-1.5">
                <BadgeCheck aria-hidden />
                <span className="sr-only">{tl('verified')}</span>
              </Badge>
            )}
          </p>
          <p className="text-sm text-sand-500">
            {advertiser.kind === 'agency' ? t('agency') : t('owner')}
          </p>
          {advertiser.slug && (
            <Link
              href={`/agencies/${advertiser.slug}`}
              className="text-sm font-semibold text-lapis-600 hover:text-lapis-700"
            >
              {t('viewAgency')}
            </Link>
          )}
        </div>
      </div>
      {advertiser.agent && (
        <p className="mt-3 rounded-md bg-sand-50 px-3 py-2 text-sm text-sand-700">
          {t('agentLabel', { name: advertiser.agent.name[locale] })}
        </p>
      )}
      <ContactButtons
        phone={advertiser.phone}
        message={t('whatsappMessage', { ref: listing.id, url: pageUrl })}
        className="mt-5"
      />
      <p className="mt-3 text-center text-xs text-sand-500">{t('mentionMahalla')}</p>
    </div>
  );
}

/** Sticky call/WhatsApp bar on phones, where most Iraqi users contact advertisers. */
export function MobileContactBar({
  listing,
  pageUrl,
}: {
  listing: ListingCardData;
  pageUrl: string;
}) {
  const t = useTranslations('property');
  const contact = useContact(
    listing.advertiser.phone,
    t('whatsappMessage', { ref: listing.id, url: pageUrl }),
  );
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 border-t border-sand-200 bg-white/95 p-3 backdrop-blur lg:hidden',
      )}
    >
      <div className="mx-auto grid max-w-[640px] grid-cols-2 gap-2">
        <CallButton contact={contact} compact className="w-full" />
        <WhatsAppButton contact={contact} className="w-full" />
      </div>
      <DemoDialog action={contact.demo} onClose={() => contact.setDemo(null)} />
    </div>
  );
}
