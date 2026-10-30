import { DEFAULT_LOCALE, LOCALES } from '@mahalla/shared';
import { defineRouting } from 'next-intl/routing';

/**
 * Arabic lives at the root (`/`), English under `/en` (decision Q-03).
 * Locale detection is off so Arabic stays the default for search engines and
 * first-time visitors; the switcher sets a cookie for returning visitors.
 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
  localeDetection: false,
});
