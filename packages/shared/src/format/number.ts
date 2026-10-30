import { type Locale, intlLocale } from '../locale';

const cache = new Map<string, Intl.NumberFormat>();

function formatter(locale: Locale, options: Intl.NumberFormatOptions = {}): Intl.NumberFormat {
  const key = `${locale}:${JSON.stringify(options)}`;
  let nf = cache.get(key);
  if (!nf) {
    // Grouping always uses a Latin comma so numbers read identically in both languages.
    nf = new Intl.NumberFormat(locale === 'ar' ? 'en-US' : intlLocale(locale), options);
    cache.set(key, nf);
  }
  return nf;
}

export function formatNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions,
): string {
  return formatter(locale, options).format(value);
}
