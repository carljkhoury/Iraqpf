import type { Locale } from '../locale';
import { formatNumber } from './number';

export type Currency = 'IQD' | 'USD';
export type RentPeriod = 'monthly' | 'yearly';

export interface PriceInput {
  amount: number;
  currency: Currency;
}

interface CompactUnit {
  value: number;
  ar: string;
  en: string;
}

const COMPACT_UNITS: CompactUnit[] = [
  { value: 1_000_000_000, ar: 'مليار', en: 'B' },
  { value: 1_000_000, ar: 'مليون', en: 'M' },
  { value: 1_000, ar: 'ألف', en: 'K' },
];

const CURRENCY_LABEL: Record<Currency, Record<Locale, string>> = {
  IQD: { ar: 'د.ع', en: 'IQD' },
  USD: { ar: '$', en: '$' },
};

function compactParts(amount: number, locale: Locale): { number: string; unit: string } {
  for (const unit of COMPACT_UNITS) {
    if (amount >= unit.value) {
      const scaled = amount / unit.value;
      const number = formatNumber(scaled, locale, {
        maximumFractionDigits: scaled < 10 ? 2 : scaled < 100 ? 1 : 0,
      });
      return { number, unit: unit[locale] };
    }
  }
  return { number: formatNumber(amount, locale), unit: '' };
}

export interface DisplayParts {
  /** Digits (and Latin symbols) that must render left-to-right. */
  number: string;
  /** Text shown before the number in reading order (e.g. `IQD`, `$`). */
  before: string;
  /** Text shown after the number in reading order (e.g. `مليون د.ع`). */
  after: string;
}

/**
 * Splits a price so the UI can isolate only the digits as LTR. Wrapping the
 * whole string (including Arabic words like `د.ع`) in LTR breaks Arabic text.
 */
export function formatPriceParts(
  { amount, currency }: PriceInput,
  locale: Locale,
  { compact = false }: { compact?: boolean } = {},
): DisplayParts {
  const label = CURRENCY_LABEL[currency][locale];
  const { number, unit } = compact
    ? compactParts(amount, locale)
    : { number: formatNumber(amount, locale, { maximumFractionDigits: 0 }), unit: '' };

  if (locale === 'ar') {
    return { number, before: '', after: [unit, label].filter(Boolean).join(' ') };
  }
  if (currency === 'USD') return { number: `$${number}${unit}`, before: '', after: '' };
  return { number: `${number}${unit}`, before: label, after: '' };
}

export function joinParts({ number, before, after }: DisplayParts): string {
  return [before, number, after].filter(Boolean).join(' ');
}

/**
 * Formats a price as plain text (metadata, share text, aria labels).
 *
 * - ar: `285,000 $`, `750,000 د.ع`, compact `250 مليون د.ع`
 * - en: `$285,000`, `IQD 750,000`, compact `IQD 250M`, `$285K`
 */
export function formatPrice(
  price: PriceInput,
  locale: Locale,
  options: { compact?: boolean } = {},
): string {
  return joinParts(formatPriceParts(price, locale, options));
}
