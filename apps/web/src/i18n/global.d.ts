import type messages from '@mahalla/i18n/messages/en';
import type { routing } from './routing';

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
