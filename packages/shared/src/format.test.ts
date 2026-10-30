import { describe, expect, it } from 'vitest';
import {
  formatArea,
  formatIraqiPhone,
  formatAreaParts,
  formatPrice,
  formatPriceParts,
  formatRelativeTime,
  normalizeForSearch,
  normalizeIraqiMobile,
  toSquareMetres,
  whatsappLink,
} from './index';

describe('formatPrice', () => {
  it('formats full prices per locale', () => {
    expect(formatPrice({ amount: 285000, currency: 'USD' }, 'ar')).toBe('285,000 $');
    expect(formatPrice({ amount: 285000, currency: 'USD' }, 'en')).toBe('$285,000');
    expect(formatPrice({ amount: 750000, currency: 'IQD' }, 'ar')).toBe('750,000 د.ع');
    expect(formatPrice({ amount: 750000, currency: 'IQD' }, 'en')).toBe('IQD 750,000');
  });

  it('formats compact prices', () => {
    expect(formatPrice({ amount: 250_000_000, currency: 'IQD' }, 'ar', { compact: true })).toBe(
      '250 مليون د.ع',
    );
    expect(formatPrice({ amount: 250_000_000, currency: 'IQD' }, 'en', { compact: true })).toBe(
      'IQD 250M',
    );
    expect(formatPrice({ amount: 1_250_000_000, currency: 'IQD' }, 'en', { compact: true })).toBe(
      'IQD 1.25B',
    );
    expect(formatPrice({ amount: 285_000, currency: 'USD' }, 'en', { compact: true })).toBe(
      '$285K',
    );
    expect(formatPrice({ amount: 285_000, currency: 'USD' }, 'ar', { compact: true })).toBe(
      '285 ألف $',
    );
    expect(formatPrice({ amount: 900, currency: 'USD' }, 'en', { compact: true })).toBe('$900');
  });
});

describe('display parts', () => {
  it('keeps Arabic words out of the LTR number part', () => {
    expect(
      formatPriceParts({ amount: 250_000_000, currency: 'IQD' }, 'ar', { compact: true }),
    ).toEqual({
      number: '250',
      before: '',
      after: 'مليون د.ع',
    });
    expect(formatPriceParts({ amount: 750_000, currency: 'IQD' }, 'en')).toEqual({
      number: '750,000',
      before: 'IQD',
      after: '',
    });
    expect(formatAreaParts(300, 'ar')).toEqual({ number: '300', before: '', after: 'م²' });
  });
});

describe('area', () => {
  it('converts and formats units', () => {
    expect(toSquareMetres(2, 'dunam')).toBe(5000);
    expect(formatArea(200, 'ar')).toBe('200 م²');
    expect(formatArea(200, 'en')).toBe('200 m²');
    expect(formatArea(6250, 'en', 'dunam')).toBe('2.5 dunams');
    expect(formatArea(2500, 'ar', 'dunam')).toBe('1 دونم');
  });
});

describe('Iraqi phone numbers', () => {
  it.each([
    ['0770 123 4567', '+9647701234567'],
    ['07701234567', '+9647701234567'],
    ['+964 770 123 4567', '+9647701234567'],
    ['009647801234567', '+9647801234567'],
    ['٠٧٥٠١٢٣٤٥٦٧', '+9647501234567'],
  ])('normalizes %s', (input, expected) => {
    expect(normalizeIraqiMobile(input)).toBe(expected);
  });

  it.each(['0710 123 4567', '12345', '0770 123 456', '+971501234567'])('rejects %s', (input) => {
    expect(normalizeIraqiMobile(input)).toBeNull();
  });

  it('formats for display and WhatsApp', () => {
    expect(formatIraqiPhone('+9647701234567')).toBe('0770 123 4567');
    expect(whatsappLink('+9647701234567')).toBe('https://wa.me/9647701234567');
  });
});

describe('formatRelativeTime', () => {
  const now = new Date('2026-10-30T12:00:00Z');
  it('uses Arabic plural forms with Western digits', () => {
    expect(formatRelativeTime(new Date('2026-10-28T12:00:00Z'), 'ar', now)).toBe('أول أمس');
    expect(formatRelativeTime(new Date('2026-10-25T12:00:00Z'), 'ar', now)).toBe('قبل 5 أيام');
    expect(formatRelativeTime(new Date('2026-10-28T12:00:00Z'), 'en', now)).toBe('2 days ago');
  });
});

describe('normalizeForSearch', () => {
  it('matches common Arabic spelling variants', () => {
    expect(normalizeForSearch('الكرادة')).toBe(normalizeForSearch('الكراده'));
    expect(normalizeForSearch('الأعظمية')).toBe(normalizeForSearch('الاعظميه'));
    expect(normalizeForSearch('كرّادة')).toBe(normalizeForSearch('كرادة'));
    expect(normalizeForSearch('Al-Mansour')).toBe('mansour');
    expect(normalizeForSearch('حي الجامعة')).toBe('حي جامعه');
  });
});
