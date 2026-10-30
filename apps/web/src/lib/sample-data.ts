/**
 * SAMPLE DATA for Phase 2 design review only.
 *
 * Every listing and agency below is fictional. In Phase 3 these are replaced by
 * API calls to the listings and organizations modules; the shapes here mirror
 * what those endpoints will return for cards.
 */
import type { AreaUnit, Currency, LocalizedText, Purpose, RentPeriod } from '@mahalla/shared';
import type { CategoryKey } from './catalog';

export interface ListingCardData {
  id: number;
  slug: string;
  purpose: Purpose;
  category: CategoryKey;
  price: { amount: number; currency: Currency };
  rentPeriod?: RentPeriod;
  bedrooms?: number;
  bathrooms?: number;
  areaM2: number;
  areaUnit: AreaUnit;
  location: { name: LocalizedText; city: LocalizedText };
  image: string;
  imageCount: number;
  featured: boolean;
  verified: boolean;
  deed?: 'tabu_sirf' | 'agricultural' | 'musha' | 'investment' | 'contract';
  furnishing?: 'furnished' | 'semi_furnished' | 'unfurnished';
  advertiser: { name: LocalizedText; initial: LocalizedText; kind: 'agency' | 'owner' };
  postedAt: string;
}

const BAGHDAD = { ar: 'بغداد', en: 'Baghdad' };
const ERBIL = { ar: 'أربيل', en: 'Erbil' };
const BASRA = { ar: 'البصرة', en: 'Basra' };

export interface AgencyCardData {
  slug: string;
  name: LocalizedText;
  initial: LocalizedText;
  city: LocalizedText;
  listingCount: number;
  verified: boolean;
  color: string;
}

export const SAMPLE_AGENCIES: AgencyCardData[] = [
  {
    slug: 'al-nakheel-properties',
    name: { ar: 'النخيل للعقارات', en: 'Al-Nakheel Properties' },
    initial: { ar: 'ن', en: 'N' },
    city: BAGHDAD,
    listingCount: 128,
    verified: true,
    color: '#22489A',
  },
  {
    slug: 'dar-al-salam-real-estate',
    name: { ar: 'دار السلام العقارية', en: 'Dar Al-Salam Real Estate' },
    initial: { ar: 'د', en: 'D' },
    city: BAGHDAD,
    listingCount: 86,
    verified: true,
    color: '#8F6814',
  },
  {
    slug: 'citadel-homes-erbil',
    name: { ar: 'القلعة هومز', en: 'Citadel Homes' },
    initial: { ar: 'ق', en: 'C' },
    city: ERBIL,
    listingCount: 64,
    verified: false,
    color: '#1C3A7D',
  },
  {
    slug: 'shatt-al-arab-realty',
    name: { ar: 'شط العرب للعقارات', en: 'Shatt Al-Arab Realty' },
    initial: { ar: 'ش', en: 'S' },
    city: BASRA,
    listingCount: 41,
    verified: true,
    color: '#1E8E5A',
  },
];

const [nakheel, darAlSalam, citadel, shatt] = SAMPLE_AGENCIES as [
  AgencyCardData,
  AgencyCardData,
  AgencyCardData,
  AgencyCardData,
];

function agency(a: AgencyCardData): ListingCardData['advertiser'] {
  return { name: a.name, initial: a.initial, kind: 'agency' };
}

const OWNER: ListingCardData['advertiser'] = {
  name: { ar: 'المالك', en: 'Owner' },
  initial: { ar: 'م', en: 'O' },
  kind: 'owner',
};

/** Dates are relative to "now" so the sample always looks fresh. */
function daysAgo(days: number, hours = 0): string {
  return new Date(Date.now() - (days * 24 + hours) * 3_600_000).toISOString();
}

export const SAMPLE_LISTINGS: ListingCardData[] = [
  {
    id: 48213,
    slug: 'house-for-sale-mansour-baghdad',
    purpose: 'sale',
    category: 'house',
    price: { amount: 285_000, currency: 'USD' },
    bedrooms: 4,
    bathrooms: 3,
    areaM2: 200,
    areaUnit: 'm2',
    location: { name: { ar: 'المنصور', en: 'Mansour' }, city: BAGHDAD },
    image: '/sample/house-a.svg',
    imageCount: 14,
    featured: true,
    verified: true,
    deed: 'tabu_sirf',
    advertiser: agency(nakheel),
    postedAt: daysAgo(2),
  },
  {
    id: 48190,
    slug: 'villa-for-sale-jadriya-baghdad',
    purpose: 'sale',
    category: 'villa',
    price: { amount: 650_000, currency: 'USD' },
    bedrooms: 5,
    bathrooms: 5,
    areaM2: 400,
    areaUnit: 'm2',
    location: { name: { ar: 'الجادرية', en: 'Jadriya' }, city: BAGHDAD },
    image: '/sample/villa.svg',
    imageCount: 22,
    featured: true,
    verified: true,
    deed: 'tabu_sirf',
    advertiser: agency(darAlSalam),
    postedAt: daysAgo(4),
  },
  {
    id: 48177,
    slug: 'apartment-for-sale-dream-city-erbil',
    purpose: 'sale',
    category: 'apartment',
    price: { amount: 165_000, currency: 'USD' },
    bedrooms: 3,
    bathrooms: 2,
    areaM2: 175,
    areaUnit: 'm2',
    location: { name: { ar: 'دريم سيتي', en: 'Dream City' }, city: ERBIL },
    image: '/sample/apartment-b.svg',
    imageCount: 18,
    featured: true,
    verified: true,
    deed: 'investment',
    advertiser: agency(citadel),
    postedAt: daysAgo(5),
  },
  {
    id: 48150,
    slug: 'house-for-sale-jazair-basra',
    purpose: 'sale',
    category: 'house',
    price: { amount: 450_000_000, currency: 'IQD' },
    bedrooms: 4,
    bathrooms: 3,
    areaM2: 300,
    areaUnit: 'm2',
    location: { name: { ar: 'الجزائر', en: 'Al-Jazair' }, city: BASRA },
    image: '/sample/house-b.svg',
    imageCount: 11,
    featured: true,
    verified: false,
    deed: 'tabu_sirf',
    advertiser: agency(shatt),
    postedAt: daysAgo(6),
  },
  {
    id: 48240,
    slug: 'apartment-for-rent-karrada-baghdad',
    purpose: 'rent',
    category: 'apartment',
    price: { amount: 750_000, currency: 'IQD' },
    rentPeriod: 'monthly',
    bedrooms: 3,
    bathrooms: 2,
    areaM2: 140,
    areaUnit: 'm2',
    location: { name: { ar: 'الكرادة', en: 'Karrada' }, city: BAGHDAD },
    image: '/sample/apartment-a.svg',
    imageCount: 9,
    featured: false,
    verified: true,
    furnishing: 'furnished',
    advertiser: agency(darAlSalam),
    postedAt: daysAgo(0, 3),
  },
  {
    id: 48236,
    slug: 'house-for-rent-yarmouk-baghdad',
    purpose: 'rent',
    category: 'house',
    price: { amount: 1_200_000, currency: 'IQD' },
    rentPeriod: 'monthly',
    bedrooms: 4,
    bathrooms: 3,
    areaM2: 250,
    areaUnit: 'm2',
    location: { name: { ar: 'اليرموك', en: 'Yarmouk' }, city: BAGHDAD },
    image: '/sample/house-b.svg',
    imageCount: 7,
    featured: false,
    verified: false,
    furnishing: 'unfurnished',
    advertiser: OWNER,
    postedAt: daysAgo(0, 9),
  },
  {
    id: 48231,
    slug: 'apartment-for-rent-ankawa-erbil',
    purpose: 'rent',
    category: 'apartment',
    price: { amount: 800, currency: 'USD' },
    rentPeriod: 'monthly',
    bedrooms: 2,
    bathrooms: 2,
    areaM2: 120,
    areaUnit: 'm2',
    location: { name: { ar: 'عنكاوة', en: 'Ankawa' }, city: ERBIL },
    image: '/sample/apartment-b.svg',
    imageCount: 12,
    featured: false,
    verified: true,
    furnishing: 'semi_furnished',
    advertiser: agency(citadel),
    postedAt: daysAgo(1),
  },
  {
    id: 48228,
    slug: 'residential-land-for-sale-ghazaliya-baghdad',
    purpose: 'sale',
    category: 'residential_land',
    price: { amount: 185_000_000, currency: 'IQD' },
    areaM2: 200,
    areaUnit: 'm2',
    location: { name: { ar: 'الغزالية', en: 'Ghazaliya' }, city: BAGHDAD },
    image: '/sample/land.svg',
    imageCount: 4,
    featured: false,
    verified: false,
    deed: 'tabu_sirf',
    advertiser: OWNER,
    postedAt: daysAgo(1, 6),
  },
  {
    id: 48222,
    slug: 'office-for-rent-arasat-baghdad',
    purpose: 'rent',
    category: 'office',
    price: { amount: 2_500_000, currency: 'IQD' },
    rentPeriod: 'monthly',
    bathrooms: 2,
    areaM2: 120,
    areaUnit: 'm2',
    location: { name: { ar: 'العرصات', en: 'Arasat' }, city: BAGHDAD },
    image: '/sample/office.svg',
    imageCount: 8,
    featured: false,
    verified: true,
    advertiser: agency(nakheel),
    postedAt: daysAgo(2, 2),
  },
  {
    id: 48219,
    slug: 'farm-for-sale-abu-al-khaseeb-basra',
    purpose: 'sale',
    category: 'farm',
    price: { amount: 320_000_000, currency: 'IQD' },
    areaM2: 12_500,
    areaUnit: 'dunam',
    location: { name: { ar: 'أبو الخصيب', en: 'Abu al-Khaseeb' }, city: BASRA },
    image: '/sample/farm.svg',
    imageCount: 6,
    featured: false,
    verified: false,
    deed: 'agricultural',
    advertiser: agency(shatt),
    postedAt: daysAgo(3),
  },
];

export interface PopularArea {
  path: string;
  name: LocalizedText;
  city: LocalizedText;
  listingCount: number;
}

export const SAMPLE_POPULAR_AREAS: PopularArea[] = [
  {
    path: 'baghdad/mansour',
    name: { ar: 'المنصور', en: 'Mansour' },
    city: BAGHDAD,
    listingCount: 1240,
  },
  {
    path: 'baghdad/karrada',
    name: { ar: 'الكرادة', en: 'Karrada' },
    city: BAGHDAD,
    listingCount: 986,
  },
  {
    path: 'baghdad/zayouna',
    name: { ar: 'زيونة', en: 'Zayouna' },
    city: BAGHDAD,
    listingCount: 712,
  },
  {
    path: 'baghdad/jadriya',
    name: { ar: 'الجادرية', en: 'Jadriya' },
    city: BAGHDAD,
    listingCount: 431,
  },
  { path: 'erbil/ankawa', name: { ar: 'عنكاوة', en: 'Ankawa' }, city: ERBIL, listingCount: 655 },
  {
    path: 'erbil/dream-city',
    name: { ar: 'دريم سيتي', en: 'Dream City' },
    city: ERBIL,
    listingCount: 318,
  },
  {
    path: 'basra/jazair',
    name: { ar: 'الجزائر', en: 'Al-Jazair' },
    city: BASRA,
    listingCount: 402,
  },
  {
    path: 'basra/baradiya',
    name: { ar: 'البراضعية', en: 'Al-Baradiya' },
    city: BASRA,
    listingCount: 276,
  },
];
