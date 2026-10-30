export const LOCALES = ['ar', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'ar';

export const RTL_LOCALES: readonly Locale[] = ['ar'];

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

export function localeDirection(locale: Locale): 'rtl' | 'ltr' {
  return RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
}

/**
 * BCP 47 tag used for all Intl formatting. Arabic is forced to Western digits
 * (`nu-latn`) per decision Q-04, so prices and phone numbers match what Iraqis
 * type into their phones.
 */
export function intlLocale(locale: Locale): string {
  return locale === 'ar' ? 'ar-IQ-u-nu-latn' : 'en-GB';
}
