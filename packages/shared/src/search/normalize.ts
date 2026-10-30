/**
 * Normalizes Arabic and Latin text for matching, so "الكراده", "الكرادة" and
 * "Karada" style variations find each other (architecture §5).
 */
export function normalizeForSearch(input: string): string {
  return input
    .normalize('NFKC')
    .replace(/[ً-ٰٟۖ-ۭ]/g, '') // tashkeel
    .replace(/ـ/g, '') // tatweel
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/^ال(?=\S)/u, '')
    .replace(/\s+ال(?=\S)/gu, ' ')
    .toLowerCase()
    .replace(/^al[- ]/, '')
    .replace(/[-_']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
