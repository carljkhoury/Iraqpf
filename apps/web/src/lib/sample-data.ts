/**
 * SAMPLE DATA for Phase 2 design review only.
 *
 * Every listing and agency below is fictional, generated deterministically
 * (same output on every build) so pages and tests are stable. Prices follow
 * rough Iraqi market levels per area and property type. In Phase 3 this file
 * is replaced by the listings and organizations API; the shapes mirror what
 * those endpoints will return.
 *
 * Photos are free Unsplash images (Unsplash License) loaded in the visitor's
 * browser; if one fails to load, the card falls back to an illustration.
 */
import type { AreaUnit, Currency, LocalizedText, Purpose, RentPeriod } from '@mahalla/shared';
import { toSquareMetres } from '@mahalla/shared';
import type { CategoryKey } from './catalog';
import { USD_TO_IQD } from './exchange';

export type DeedKey = 'tabu_sirf' | 'agricultural' | 'musha' | 'investment' | 'contract';
export type FurnishingKey = 'furnished' | 'semi_furnished' | 'unfurnished';
export type AmenityKey =
  | 'generator'
  | 'dedicated_power'
  | 'water_tank'
  | 'garage'
  | 'garden'
  | 'fitted_kitchen'
  | 'central_ac'
  | 'solar'
  | 'elevator'
  | 'security'
  | 'parking'
  | 'main_road';

export interface ListingCardData {
  id: number;
  slug: string;
  purpose: Purpose;
  category: CategoryKey;
  title: LocalizedText;
  description: LocalizedText;
  price: { amount: number; currency: Currency };
  /** Normalized for filtering and sorting across currencies (decision E-01). */
  priceUsd: number;
  rentPeriod?: RentPeriod;
  bedrooms?: number;
  bathrooms?: number;
  areaM2: number;
  areaUnit: AreaUnit;
  /** Land area for houses, villas and buildings. */
  plotM2?: number;
  /** 0 = ground floor. Apartments and offices. */
  floor?: number;
  amenities: AmenityKey[];
  /** Location path, e.g. `baghdad/karrada` (matches `lib/locations.ts`). */
  locationPath: string;
  location: { name: LocalizedText; city: LocalizedText };
  photos: string[];
  fallbackImage: string;
  featured: boolean;
  verified: boolean;
  deed?: DeedKey;
  furnishing?: FurnishingKey;
  advertiser: {
    name: LocalizedText;
    initial: LocalizedText;
    kind: 'agency' | 'owner';
    slug?: string;
    /** E.164. Sample numbers only; calls are blocked while SAMPLE_MODE is on. */
    phone: string;
  };
  postedAt: string;
}

export interface AgencyCardData {
  slug: string;
  name: LocalizedText;
  initial: LocalizedText;
  city: LocalizedText;
  cityKey: CityKey;
  listingCount: number;
  verified: boolean;
  color: string;
  phone: string;
}

export interface PopularArea {
  path: string;
  name: LocalizedText;
  city: LocalizedText;
  listingCount: number;
}

type CityKey = 'baghdad' | 'erbil' | 'basra';

const CITY: Record<CityKey, LocalizedText> = {
  baghdad: { ar: 'بغداد', en: 'Baghdad' },
  erbil: { ar: 'أربيل', en: 'Erbil' },
  basra: { ar: 'البصرة', en: 'Basra' },
};

// ---------------------------------------------------------------------------
// Deterministic random numbers (mulberry32), so every build is identical.
// ---------------------------------------------------------------------------
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(964);
const between = (min: number, max: number) => min + rand() * (max - min);
const int = (min: number, max: number) => Math.floor(between(min, max + 1));
const chance = (p: number) => rand() < p;
function pick<T>(items: readonly T[]): T {
  return items[Math.floor(rand() * items.length)] as T;
}
function weighted<T>(items: readonly (readonly [T, number])[]): T {
  const total = items.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  for (const [item, w] of items) {
    if ((r -= w) <= 0) return item;
  }
  return items[items.length - 1]![0];
}
function sample<T>(items: readonly T[], n: number): T[] {
  return [...items].sort(() => rand() - 0.5).slice(0, n);
}

// ---------------------------------------------------------------------------
// Areas, with a price tier (1 = city average).
// ---------------------------------------------------------------------------
interface Area {
  slug: string;
  name: LocalizedText;
  city: CityKey;
  tier: number;
  weight: number;
}

const AREAS: Area[] = [
  {
    slug: 'mansour',
    name: { ar: 'المنصور', en: 'Mansour' },
    city: 'baghdad',
    tier: 1.6,
    weight: 5,
  },
  {
    slug: 'karrada',
    name: { ar: 'الكرادة', en: 'Karrada' },
    city: 'baghdad',
    tier: 1.3,
    weight: 5,
  },
  {
    slug: 'jadriya',
    name: { ar: 'الجادرية', en: 'Jadriya' },
    city: 'baghdad',
    tier: 1.8,
    weight: 3,
  },
  { slug: 'zayouna', name: { ar: 'زيونة', en: 'Zayouna' }, city: 'baghdad', tier: 1.4, weight: 4 },
  {
    slug: 'yarmouk',
    name: { ar: 'اليرموك', en: 'Yarmouk' },
    city: 'baghdad',
    tier: 1.4,
    weight: 4,
  },
  {
    slug: 'harthiya',
    name: { ar: 'الحارثية', en: 'Harthiya' },
    city: 'baghdad',
    tier: 1.5,
    weight: 2,
  },
  { slug: 'arasat', name: { ar: 'العرصات', en: 'Arasat' }, city: 'baghdad', tier: 1.5, weight: 2 },
  {
    slug: 'adhamiya',
    name: { ar: 'الأعظمية', en: 'Adhamiya' },
    city: 'baghdad',
    tier: 1.1,
    weight: 3,
  },
  {
    slug: 'palestine-street',
    name: { ar: 'شارع فلسطين', en: 'Palestine Street' },
    city: 'baghdad',
    tier: 1.2,
    weight: 3,
  },
  {
    slug: 'ghazaliya',
    name: { ar: 'الغزالية', en: 'Ghazaliya' },
    city: 'baghdad',
    tier: 0.9,
    weight: 3,
  },
  {
    slug: 'saydiya',
    name: { ar: 'السيدية', en: 'Saydiya' },
    city: 'baghdad',
    tier: 0.85,
    weight: 2,
  },
  { slug: 'dora', name: { ar: 'الدورة', en: 'Dora' }, city: 'baghdad', tier: 0.75, weight: 2 },
  {
    slug: 'baladiyat',
    name: { ar: 'البلديات', en: 'Al-Baladiyat' },
    city: 'baghdad',
    tier: 0.9,
    weight: 2,
  },
  {
    slug: 'kadhimiya',
    name: { ar: 'الكاظمية', en: 'Kadhimiya' },
    city: 'baghdad',
    tier: 1.0,
    weight: 2,
  },
  { slug: 'ankawa', name: { ar: 'عنكاوة', en: 'Ankawa' }, city: 'erbil', tier: 1.2, weight: 4 },
  {
    slug: 'dream-city',
    name: { ar: 'دريم سيتي', en: 'Dream City' },
    city: 'erbil',
    tier: 1.5,
    weight: 3,
  },
  {
    slug: 'english-village',
    name: { ar: 'القرية الإنكليزية', en: 'English Village' },
    city: 'erbil',
    tier: 1.6,
    weight: 2,
  },
  {
    slug: 'italian-village',
    name: { ar: 'القرية الإيطالية', en: 'Italian Village' },
    city: 'erbil',
    tier: 1.5,
    weight: 2,
  },
  { slug: 'gulan', name: { ar: 'كولان', en: 'Gulan' }, city: 'erbil', tier: 1.2, weight: 2 },
  { slug: 'iskan', name: { ar: 'الإسكان', en: 'Iskan' }, city: 'erbil', tier: 0.9, weight: 2 },
  { slug: 'jazair', name: { ar: 'الجزائر', en: 'Al-Jazair' }, city: 'basra', tier: 1.3, weight: 3 },
  {
    slug: 'baradiya',
    name: { ar: 'البراضعية', en: 'Al-Baradiya' },
    city: 'basra',
    tier: 1.1,
    weight: 3,
  },
  {
    slug: 'tuwaisa',
    name: { ar: 'الطويسة', en: 'Al-Tuwaisa' },
    city: 'basra',
    tier: 1.0,
    weight: 2,
  },
  {
    slug: 'muhandiseen',
    name: { ar: 'حي المهندسين', en: 'Hay al-Muhandiseen' },
    city: 'basra',
    tier: 1.2,
    weight: 2,
  },
  { slug: 'ashar', name: { ar: 'العشار', en: 'Al-Ashar' }, city: 'basra', tier: 1.0, weight: 2 },
];

// ---------------------------------------------------------------------------
// Agencies
// ---------------------------------------------------------------------------
const AGENCIES: Omit<AgencyCardData, 'listingCount'>[] = [
  {
    slug: 'al-nakheel-properties',
    name: { ar: 'النخيل للعقارات', en: 'Al-Nakheel Properties' },
    initial: { ar: 'ن', en: 'N' },
    city: CITY.baghdad,
    cityKey: 'baghdad',
    verified: true,
    color: '#22489A',
    phone: '+9647700000001',
  },
  {
    slug: 'dar-al-salam-real-estate',
    name: { ar: 'دار السلام العقارية', en: 'Dar Al-Salam Real Estate' },
    initial: { ar: 'د', en: 'D' },
    city: CITY.baghdad,
    cityKey: 'baghdad',
    verified: true,
    color: '#8F6814',
    phone: '+9647800000002',
  },
  {
    slug: 'rusafa-realty',
    name: { ar: 'الرصافة العقارية', en: 'Rusafa Realty' },
    initial: { ar: 'ر', en: 'R' },
    city: CITY.baghdad,
    cityKey: 'baghdad',
    verified: false,
    color: '#45413B',
    phone: '+9647500000003',
  },
  {
    slug: 'citadel-homes-erbil',
    name: { ar: 'القلعة هومز', en: 'Citadel Homes' },
    initial: { ar: 'ق', en: 'C' },
    city: CITY.erbil,
    cityKey: 'erbil',
    verified: true,
    color: '#1C3A7D',
    phone: '+9647500000004',
  },
  {
    slug: 'shatt-al-arab-realty',
    name: { ar: 'شط العرب للعقارات', en: 'Shatt Al-Arab Realty' },
    initial: { ar: 'ش', en: 'S' },
    city: CITY.basra,
    cityKey: 'basra',
    verified: true,
    color: '#1E8E5A',
    phone: '+9647800000005',
  },
  {
    slug: 'al-fayhaa-real-estate',
    name: { ar: 'الفيحاء العقارية', en: 'Al-Fayhaa Real Estate' },
    initial: { ar: 'ف', en: 'F' },
    city: CITY.basra,
    cityKey: 'basra',
    verified: false,
    color: '#B7791F',
    phone: '+9647700000006',
  },
];

const OWNER: ListingCardData['advertiser'] = {
  name: { ar: 'المالك', en: 'Owner' },
  initial: { ar: 'م', en: 'O' },
  kind: 'owner',
  phone: '+9647900000009',
};

// ---------------------------------------------------------------------------
// Photos (Unsplash photo IDs), grouped by what they show.
// ---------------------------------------------------------------------------
const PHOTOS = {
  house: ['lnUFHdyRpGA', 'W7XqqixNnII', 'QIOVlUyNZX0', '3qRx6B4cT6g', 'mN6l37Didcc', 'hHz4yrvxwlA'],
  villa: ['Id7u0EkTjBE', 'g39p1kDjvSY', 'PJme5xAc-m4', 'ZIcRkI_cjWc', 'kL-s6u1JlQs', 'hHz4yrvxwlA'],
  building: [
    '3fPZoXU1zH4',
    '1iGG6k4Ci4E',
    'ZMeYdUGeQO0',
    '9NNAR40GXVM',
    'L7uHzS7rUY8',
    'WRg38tlUX2M',
  ],
  living: [
    'g_5UyVBIX_k',
    'DY7wJD6Ly2s',
    '6ybDmGNE2Yg',
    'Qe8eMrwTW5g',
    'js8AQlw71HA',
    'NTaF5rBmlyE',
  ],
  kitchen: [
    'mV18BlmQJrQ',
    'i6SOaGYmNOA',
    'Web_hE7_coQ',
    'kE6Luqa4bBQ',
    'oCw5_evbWyI',
    'j6QSUeiW6vo',
  ],
  bedroom: [
    'p6pfOaavscc',
    'OBdX8YelOro',
    'CV72K5d6urM',
    't0pjgKGIisU',
    'BLZ4xjos6E0',
    'eqfrNekSYp8',
  ],
  office: ['Ugnm0F4e00U', 'PG8NyM_Mcts', 'EUEfQjgt-mw'],
  shop: ['KwzqAB_0_lA', 'PyHrr8nZXvs', 'm5D5dHWHfSk'],
  warehouse: ['ePx249WBTNY', '-436tTUEGSE', 'iqNMyQdTyK0', 'CeRq-JzKGi4'],
  land: ['uR7iFvILtWc', 'LPJ5zPGIP8A'],
  farm: ['c3GxJkt7tV0', 'KZFPqqd2nJs', 'ARpmY5qq7Lk'],
} as const;

// ---------------------------------------------------------------------------
// Per-category rules: purposes, price levels (USD, city-average tier), sizes.
// ---------------------------------------------------------------------------
interface CategoryRule {
  weight: number;
  purposes: readonly (readonly [Purpose, number])[];
  /** Sale price in USD; for land/farms this is per m² (land) or per dunam (farm). */
  sale: number;
  salePer?: 'm2' | 'dunam';
  rentMonthly?: number;
  keyMoney?: number;
  area: [number, number];
  plot?: [number, number];
  beds?: [number, number];
  residential: boolean;
  feminine: boolean;
  exterior: readonly string[];
  interiors: readonly (readonly string[])[];
  fallback: string;
}

const RULES: Partial<Record<CategoryKey, CategoryRule>> = {
  apartment: {
    weight: 26,
    purposes: [
      ['sale', 45],
      ['rent', 55],
    ],
    sale: 140_000,
    rentMonthly: 550,
    area: [90, 220],
    beds: [1, 4],
    residential: true,
    feminine: true,
    exterior: PHOTOS.building,
    interiors: [PHOTOS.living, PHOTOS.kitchen, PHOTOS.bedroom],
    fallback: '/sample/apartment-a.svg',
  },
  house: {
    weight: 22,
    purposes: [
      ['sale', 60],
      ['rent', 40],
    ],
    sale: 260_000,
    rentMonthly: 900,
    area: [160, 400],
    plot: [150, 600],
    beds: [3, 6],
    residential: true,
    feminine: false,
    exterior: PHOTOS.house,
    interiors: [PHOTOS.living, PHOTOS.kitchen, PHOTOS.bedroom],
    fallback: '/sample/house-a.svg',
  },
  villa: {
    weight: 8,
    purposes: [
      ['sale', 75],
      ['rent', 25],
    ],
    sale: 650_000,
    rentMonthly: 2500,
    area: [320, 700],
    plot: [400, 1000],
    beds: [4, 7],
    residential: true,
    feminine: true,
    exterior: PHOTOS.villa,
    interiors: [PHOTOS.living, PHOTOS.kitchen, PHOTOS.bedroom],
    fallback: '/sample/villa.svg',
  },
  floor: {
    weight: 3,
    purposes: [
      ['rent', 80],
      ['sale', 20],
    ],
    sale: 110_000,
    rentMonthly: 450,
    area: [120, 250],
    beds: [2, 4],
    residential: true,
    feminine: false,
    exterior: PHOTOS.house,
    interiors: [PHOTOS.living, PHOTOS.kitchen, PHOTOS.bedroom],
    fallback: '/sample/house-b.svg',
  },
  annex: {
    weight: 3,
    purposes: [
      ['rent', 90],
      ['sale', 10],
    ],
    sale: 60_000,
    rentMonthly: 300,
    area: [50, 100],
    beds: [1, 2],
    residential: true,
    feminine: false,
    exterior: PHOTOS.house,
    interiors: [PHOTOS.living, PHOTOS.bedroom],
    fallback: '/sample/house-b.svg',
  },
  residential_land: {
    weight: 9,
    purposes: [['sale', 100]],
    sale: 1100,
    salePer: 'm2',
    area: [150, 600],
    residential: true,
    feminine: true,
    exterior: PHOTOS.land,
    interiors: [],
    fallback: '/sample/land.svg',
  },
  residential_building: {
    weight: 2,
    purposes: [
      ['sale', 70],
      ['rent', 30],
    ],
    sale: 550_000,
    rentMonthly: 3000,
    area: [300, 1200],
    plot: [200, 500],
    residential: true,
    feminine: true,
    exterior: PHOTOS.building,
    interiors: [PHOTOS.living],
    fallback: '/sample/apartment-b.svg',
  },
  office: {
    weight: 7,
    purposes: [
      ['rent', 75],
      ['sale', 15],
      ['key_money', 10],
    ],
    sale: 180_000,
    rentMonthly: 1200,
    keyMoney: 35_000,
    area: [50, 300],
    residential: false,
    feminine: false,
    exterior: PHOTOS.office,
    interiors: [PHOTOS.office],
    fallback: '/sample/office.svg',
  },
  shop: {
    weight: 7,
    purposes: [
      ['rent', 60],
      ['key_money', 20],
      ['sale', 20],
    ],
    sale: 150_000,
    rentMonthly: 900,
    keyMoney: 40_000,
    area: [25, 150],
    residential: false,
    feminine: false,
    exterior: PHOTOS.shop,
    interiors: [PHOTOS.shop],
    fallback: '/sample/office.svg',
  },
  warehouse: {
    weight: 3,
    purposes: [
      ['rent', 80],
      ['sale', 20],
    ],
    sale: 300_000,
    rentMonthly: 1800,
    area: [300, 2000],
    residential: false,
    feminine: false,
    exterior: PHOTOS.warehouse,
    interiors: [PHOTOS.warehouse],
    fallback: '/sample/office.svg',
  },
  commercial_land: {
    weight: 2,
    purposes: [['sale', 100]],
    sale: 1500,
    salePer: 'm2',
    area: [300, 2000],
    residential: false,
    feminine: true,
    exterior: PHOTOS.land,
    interiors: [],
    fallback: '/sample/land.svg',
  },
  farm: {
    weight: 4,
    purposes: [
      ['sale', 85],
      ['rent', 15],
    ],
    sale: 20_000,
    salePer: 'dunam',
    rentMonthly: 800,
    area: [2.5, 25],
    residential: false,
    feminine: false,
    exterior: PHOTOS.farm,
    interiors: [PHOTOS.farm],
    fallback: '/sample/farm.svg',
  },
  agricultural_land: {
    weight: 2,
    purposes: [['sale', 100]],
    sale: 12_000,
    salePer: 'dunam',
    area: [2.5, 40],
    residential: false,
    feminine: true,
    exterior: PHOTOS.farm,
    interiors: [],
    fallback: '/sample/farm.svg',
  },
};

const CATEGORY_NAME: Partial<Record<CategoryKey, LocalizedText>> = {
  apartment: { ar: 'شقة', en: 'apartment' },
  house: { ar: 'بيت', en: 'house' },
  villa: { ar: 'فيلا', en: 'villa' },
  floor: { ar: 'طابق', en: 'floor' },
  annex: { ar: 'مشتمل', en: 'annex' },
  residential_land: { ar: 'أرض سكنية', en: 'residential plot' },
  residential_building: { ar: 'عمارة سكنية', en: 'residential building' },
  office: { ar: 'مكتب', en: 'office' },
  shop: { ar: 'محل تجاري', en: 'shop' },
  warehouse: { ar: 'مخزن', en: 'warehouse' },
  commercial_land: { ar: 'أرض تجارية', en: 'commercial plot' },
  farm: { ar: 'بستان', en: 'orchard' },
  agricultural_land: { ar: 'أرض زراعية', en: 'agricultural land' },
};

const ADJECTIVES: { m: string; f: string; en: string; for: 'built' | 'land' | 'any' }[] = [
  { m: 'حديث', f: 'حديثة', en: 'Modern', for: 'built' },
  { m: 'واسع', f: 'واسعة', en: 'Spacious', for: 'built' },
  { m: 'مجدد', f: 'مجددة', en: 'Renovated', for: 'built' },
  { m: 'فاخر', f: 'فاخرة', en: 'Luxury', for: 'built' },
  { m: 'ممتاز', f: 'ممتازة', en: 'Prime', for: 'any' },
  { m: 'بموقع مميز', f: 'بموقع مميز', en: 'Well-located', for: 'any' },
  { m: 'ركن', f: 'ركن', en: 'Corner', for: 'land' },
];

const AMENITY_TEXT: Record<AmenityKey, LocalizedText> = {
  generator: { ar: 'مولدة أهلية', en: 'neighbourhood generator' },
  dedicated_power: { ar: 'خط ذهبي', en: 'dedicated power line' },
  water_tank: { ar: 'خزان ماء', en: 'water tank' },
  garage: { ar: 'كراج', en: 'garage' },
  garden: { ar: 'حديقة', en: 'garden' },
  fitted_kitchen: { ar: 'مطبخ مجهز', en: 'fitted kitchen' },
  central_ac: { ar: 'تبريد مركزي', en: 'central A/C' },
  solar: { ar: 'منظومة طاقة شمسية', en: 'solar power system' },
  elevator: { ar: 'مصعد', en: 'elevator' },
  security: { ar: 'حراسة', en: 'security guard' },
  parking: { ar: 'موقف سيارات', en: 'parking' },
  main_road: { ar: 'قريب من شارع رئيسي', en: 'close to a main road' },
};

const AMENITIES_BY_KIND: Record<'home' | 'apartment' | 'commercial', AmenityKey[]> = {
  home: [
    'generator',
    'dedicated_power',
    'water_tank',
    'garage',
    'garden',
    'fitted_kitchen',
    'central_ac',
    'solar',
    'main_road',
  ],
  apartment: [
    'generator',
    'dedicated_power',
    'water_tank',
    'fitted_kitchen',
    'central_ac',
    'elevator',
    'security',
    'parking',
  ],
  commercial: ['generator', 'dedicated_power', 'parking', 'security', 'main_road', 'central_ac'],
};

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------
function roundPrice(amount: number, currency: Currency, purpose: Purpose): number {
  const step =
    currency === 'USD'
      ? purpose === 'rent'
        ? 50
        : 5_000
      : purpose === 'rent'
        ? 50_000
        : 5_000_000;
  return Math.max(step, Math.round(amount / step) * step);
}

function pickCurrency(city: CityKey, purpose: Purpose, category: CategoryKey): Currency {
  if (city === 'erbil') return chance(0.9) ? 'USD' : 'IQD';
  const landish = category.includes('land') || category === 'farm';
  if (purpose === 'rent') return chance(city === 'basra' ? 0.9 : 0.8) ? 'IQD' : 'USD';
  if (landish) return chance(0.75) ? 'IQD' : 'USD';
  return chance(city === 'basra' ? 0.7 : 0.35) ? 'IQD' : 'USD';
}

// Start of today (UTC), so all pages in one build agree on listing ages.
const TODAY = Math.floor(Date.now() / 86_400_000) * 86_400_000 + 9 * 3_600_000;

function daysAgo(days: number): string {
  return new Date(TODAY - days * 86_400_000).toISOString();
}

function generate(count: number): ListingCardData[] {
  const categoryWeights = Object.entries(RULES).map(
    ([key, rule]) => [key as CategoryKey, rule!.weight] as const,
  );
  const areaWeights = AREAS.map((a) => [a, a.weight] as const);
  const listings: ListingCardData[] = [];

  for (let i = 0; i < count; i++) {
    const category = weighted(categoryWeights);
    const rule = RULES[category]!;
    const area = weighted(areaWeights);
    const purpose = weighted(rule.purposes);
    const currency = pickCurrency(area.city, purpose, category);
    const variation = between(0.75, 1.35) * area.tier;

    // Size
    const isDunam = rule.salePer === 'dunam';
    const bedrooms = rule.beds
      ? category === 'apartment' && chance(0.05)
        ? 0
        : int(...rule.beds)
      : undefined;
    // Homes grow with their bedroom count; everything else uses the category's range.
    const sizeShare =
      rule.beds && bedrooms !== undefined
        ? (Math.max(bedrooms, rule.beds[0]) - rule.beds[0] + rand()) /
          (rule.beds[1] - rule.beds[0] + 1)
        : rand();
    const rawSize = rule.area[0] + sizeShare * (rule.area[1] - rule.area[0]);
    const rawArea = isDunam ? Math.round(rawSize * 2) / 2 : Math.round(rawSize / 5) * 5;
    const areaM2 = isDunam ? toSquareMetres(rawArea, 'dunam') : rawArea;

    // Price in USD, then the advertiser's currency
    let usd: number;
    if (purpose === 'rent') usd = (rule.rentMonthly ?? 500) * variation;
    else if (purpose === 'key_money') usd = (rule.keyMoney ?? 30_000) * variation;
    else if (rule.salePer === 'm2') usd = rule.sale * variation * areaM2;
    else if (rule.salePer === 'dunam') usd = rule.sale * variation * rawArea;
    else usd = rule.sale * variation * (0.8 + (areaM2 / rule.area[1]) * 0.4);
    const amount = roundPrice(currency === 'USD' ? usd : usd * USD_TO_IQD, currency, purpose);
    const priceUsd = currency === 'USD' ? amount : Math.round(amount / USD_TO_IQD);

    const bathrooms =
      bedrooms !== undefined
        ? Math.max(1, Math.min(bedrooms, int(bedrooms - 1, bedrooms + 1)))
        : ['office', 'shop', 'warehouse'].includes(category)
          ? int(1, 2)
          : undefined;

    const agencyPool = AGENCIES.filter((a) => a.cityKey === area.city);
    const byOwner = rule.residential && chance(0.3);
    const agency = byOwner ? null : pick(agencyPool);
    const advertiser: ListingCardData['advertiser'] = agency
      ? {
          name: agency.name,
          initial: agency.initial,
          kind: 'agency',
          slug: agency.slug,
          phone: agency.phone,
        }
      : OWNER;

    const isLand = rule.interiors.length === 0;
    const adjective = pick(
      ADJECTIVES.filter((a) => a.for === 'any' || a.for === (isLand ? 'land' : 'built')),
    );
    const name = CATEGORY_NAME[category]!;
    const title: LocalizedText = {
      ar: `${name.ar} ${rule.feminine ? adjective.f : adjective.m} في ${area.name.ar}`,
      en: `${adjective.en} ${name.en} in ${area.name.en}`,
    };

    const amenityPool = isLand
      ? []
      : rule.residential
        ? category === 'apartment' || category === 'residential_building'
          ? AMENITIES_BY_KIND.apartment
          : AMENITIES_BY_KIND.home
        : AMENITIES_BY_KIND.commercial;
    const amenities = sample(amenityPool, int(3, Math.min(6, amenityPool.length || 3)));
    const features = amenities.slice(0, 3).map((key) => AMENITY_TEXT[key]);
    const description: LocalizedText = {
      ar: [
        `${title.ar}، ${CITY[area.city].ar}.`,
        features.length ? `يتميز بـ: ${features.map((f) => f.ar).join('، ')}.` : '',
        'للتواصل والاستفسار يرجى الاتصال أو المراسلة عبر واتساب.',
      ]
        .filter(Boolean)
        .join(' '),
      en: [
        `${title.en}, ${CITY[area.city].en}.`,
        features.length ? `Features: ${features.map((f) => f.en).join(', ')}.` : '',
        'Call or message on WhatsApp for details and viewings.',
      ]
        .filter(Boolean)
        .join(' '),
    };

    const photos = [pick(rule.exterior), ...rule.interiors.map((group) => pick(group))];
    const id = 48_300 - i * 7;
    const verified = agency ? agency.verified : false;

    listings.push({
      id,
      slug: `${name.en.replace(/\s+/g, '-')}-${purpose === 'sale' ? 'for-sale' : purpose === 'rent' ? 'for-rent' : 'key-money'}-${area.slug}-${area.city}`,
      purpose,
      category,
      title,
      description,
      price: { amount, currency },
      priceUsd,
      rentPeriod:
        purpose === 'rent' ? (chance(0.1) && rule.residential ? 'yearly' : 'monthly') : undefined,
      bedrooms,
      bathrooms,
      areaM2,
      areaUnit: isDunam ? 'dunam' : 'm2',
      plotM2: rule.plot
        ? Math.max(areaM2 * 0.6, Math.round(between(...rule.plot) / 10) * 10)
        : undefined,
      floor: category === 'apartment' || category === 'office' ? int(0, 9) : undefined,
      amenities,
      locationPath: `${area.city}/${area.slug}`,
      location: { name: area.name, city: CITY[area.city] },
      photos,
      fallbackImage: rule.fallback,
      featured: chance(0.16) && verified,
      verified,
      deed:
        purpose === 'sale'
          ? isDunam
            ? 'agricultural'
            : area.city === 'erbil' && chance(0.4)
              ? 'investment'
              : weighted([
                  ['tabu_sirf', 85],
                  ['musha', 8],
                  ['contract', 7],
                ] as const)
          : undefined,
      furnishing:
        purpose === 'rent' && rule.residential && rule.beds
          ? weighted([
              ['furnished', 30],
              ['semi_furnished', 25],
              ['unfurnished', 45],
            ] as const)
          : undefined,
      advertiser,
      postedAt: daysAgo(i * 0.3 + rand() * 0.3),
    });
  }

  // Yearly rents are quoted as a yearly amount.
  for (const l of listings) {
    if (l.rentPeriod === 'yearly') {
      l.price.amount = roundPrice(l.price.amount * 11, l.price.currency, 'rent');
      l.priceUsd =
        l.price.currency === 'USD' ? l.price.amount : Math.round(l.price.amount / USD_TO_IQD);
    }
  }
  return listings;
}

export const SAMPLE_LISTINGS: ListingCardData[] = generate(72);

export const SAMPLE_AGENCIES: AgencyCardData[] = AGENCIES.map((a) => ({
  ...a,
  listingCount: SAMPLE_LISTINGS.filter((l) => l.advertiser.slug === a.slug).length,
}));

export const SAMPLE_POPULAR_AREAS: PopularArea[] = [
  'baghdad/mansour',
  'baghdad/karrada',
  'baghdad/zayouna',
  'baghdad/yarmouk',
  'erbil/ankawa',
  'erbil/dream-city',
  'basra/jazair',
  'basra/baradiya',
].map((path) => {
  const area = AREAS.find((a) => `${a.city}/${a.slug}` === path)!;
  return {
    path,
    name: area.name,
    city: CITY[area.city],
    listingCount: SAMPLE_LISTINGS.filter((l) => l.locationPath === path).length,
  };
});

/** Unsplash image URL at a given width (resolved by Unsplash to its CDN). */
export function photoUrl(id: string, width = 800): string {
  return `https://unsplash.com/photos/${id}/download?w=${width}`;
}
