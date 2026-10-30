/**
 * Iraqi mobile numbers: +964 7XX XXX XXXX (10 digits after the country code).
 * Operator prefixes: 75x Korek, 77x Asiacell, 78x/79x Zain.
 */
const IRAQI_MOBILE_PREFIXES = ['75', '77', '78', '79'];

const ARABIC_INDIC = '٠١٢٣٤٥٦٧٨٩';
const PERSIAN = '۰۱۲۳۴۵۶۷۸۹';

/** Converts Arabic-Indic and Persian digits to Western digits. */
export function toWesternDigits(input: string): string {
  return input.replace(/[٠-٩۰-۹]/g, (d) => {
    const i = ARABIC_INDIC.indexOf(d);
    return String(i >= 0 ? i : PERSIAN.indexOf(d));
  });
}

/**
 * Normalizes user input such as `0770 123 4567`, `٠٧٧٠١٢٣٤٥٦٧`, `+964 770 123 4567`
 * or `00964770...` to E.164 (`+9647701234567`). Returns null if it is not a
 * valid Iraqi mobile number.
 */
export function normalizeIraqiMobile(input: string): string | null {
  let digits = toWesternDigits(input).replace(/\D/g, '');
  if (digits.startsWith('00964')) digits = digits.slice(5);
  else if (digits.startsWith('964')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);

  if (digits.length !== 10) return null;
  if (!IRAQI_MOBILE_PREFIXES.some((p) => digits.startsWith(p))) return null;
  return `+964${digits}`;
}

export function isValidIraqiMobile(input: string): boolean {
  return normalizeIraqiMobile(input) !== null;
}

/** Formats an E.164 Iraqi number for local display: `0770 123 4567`. */
export function formatIraqiPhone(e164: string): string {
  const normalized = normalizeIraqiMobile(e164);
  if (!normalized) return e164;
  const local = `0${normalized.slice(4)}`;
  return `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}`;
}

/** WhatsApp click-to-chat link (wa.me requires digits only, no plus sign). */
export function whatsappLink(e164: string, message?: string): string | null {
  const normalized = normalizeIraqiMobile(e164);
  if (!normalized) return null;
  const base = `https://wa.me/${normalized.slice(1)}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
