import type { Locale } from './locale';

/** Translatable content stored as `{ ar, en }` (Kurdish `ku` added later). */
export type LocalizedText = Record<Locale, string>;

export type Purpose = 'sale' | 'rent' | 'key_money';
