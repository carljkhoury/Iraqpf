import type { Locale } from '../locale';
import { formatNumber } from './number';
import type { DisplayParts } from './price';
import { joinParts } from './price';

export type AreaUnit = 'm2' | 'dunam' | 'olk';

/** 1 Iraqi dunam = 2,500 m². */
export const SQM_PER_DUNAM = 2500;
/**
 * Olk conversion is pending confirmation from the Iraq team (decision E-02 / Q-07).
 * Commonly cited as one tenth of a dunam.
 */
export const SQM_PER_OLK = 250;

const UNIT_LABEL: Record<AreaUnit, Record<Locale, string>> = {
  m2: { ar: 'م²', en: 'm²' },
  dunam: { ar: 'دونم', en: 'dunam' },
  olk: { ar: 'أولك', en: 'olk' },
};

export function toSquareMetres(value: number, unit: AreaUnit): number {
  if (unit === 'dunam') return value * SQM_PER_DUNAM;
  if (unit === 'olk') return value * SQM_PER_OLK;
  return value;
}

export function fromSquareMetres(m2: number, unit: AreaUnit): number {
  if (unit === 'dunam') return m2 / SQM_PER_DUNAM;
  if (unit === 'olk') return m2 / SQM_PER_OLK;
  return m2;
}

/** Area parts for display; only `number` should be LTR-isolated. */
export function formatAreaParts(m2: number, locale: Locale, unit: AreaUnit = 'm2'): DisplayParts {
  const value = fromSquareMetres(m2, unit);
  const number = formatNumber(value, locale, { maximumFractionDigits: unit === 'm2' ? 0 : 2 });
  let label = UNIT_LABEL[unit][locale];
  if (locale === 'en' && unit !== 'm2' && value !== 1) label += 's';
  return { number, before: '', after: label };
}

/** Formats an area stored in m², displayed in the advertiser's chosen unit. */
export function formatArea(m2: number, locale: Locale, unit: AreaUnit = 'm2'): string {
  return joinParts(formatAreaParts(m2, locale, unit));
}
