/**
 * SAMPLE "my listings" for the demo advertiser account, with statuses and
 * 30 days of statistics. Phase 3 reads these from the listings and
 * listing_daily_stats tables (docs/05-database.md §7–8).
 */
import { type ListingCardData, SAMPLE_LISTINGS } from './sample-data';

export type ListingStatus =
  'live' | 'pending_review' | 'draft' | 'expired' | 'paused' | 'rejected' | 'sold_rented';

export interface DailyStat {
  date: string; // YYYY-MM-DD
  views: number;
  phoneReveals: number;
  whatsappClicks: number;
}

export interface MyListing {
  listing: ListingCardData;
  status: ListingStatus;
  expiresAt?: string;
  rejectionReason?: 'wrong_price' | 'poor_photos';
  stats: DailyStat[];
  favourites: number;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DAY = 86_400_000;
const TODAY = Math.floor(Date.now() / DAY) * DAY;

function makeStats(seed: number, base: number, days: number): DailyStat[] {
  const rand = mulberry32(seed);
  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date(TODAY - (29 - i) * DAY).toISOString().slice(0, 10);
    if (i < 30 - days) return { date, views: 0, phoneReveals: 0, whatsappClicks: 0 };
    // Fridays (day 5) are busier: people browse property at the weekend.
    const weekend = new Date(date).getUTCDay() === 5 ? 1.5 : 1;
    const views = Math.round(base * weekend * (0.6 + rand() * 0.8));
    return {
      date,
      views,
      phoneReveals: Math.round(views * (0.04 + rand() * 0.05)),
      whatsappClicks: Math.round(views * (0.06 + rand() * 0.07)),
    };
  });
}

const owned = SAMPLE_LISTINGS.filter((l) => l.advertiser.kind === 'owner').slice(0, 6);
const plan: { status: ListingStatus; base: number; days: number; expiresInDays?: number }[] = [
  { status: 'live', base: 46, days: 30, expiresInDays: 34 },
  { status: 'live', base: 28, days: 21, expiresInDays: 5 },
  { status: 'pending_review', base: 0, days: 0 },
  { status: 'expired', base: 18, days: 30, expiresInDays: -3 },
  { status: 'draft', base: 0, days: 0 },
  { status: 'rejected', base: 0, days: 0 },
];

export const MY_SAMPLE_LISTINGS: MyListing[] = owned.map((listing, i) => {
  const p = plan[i % plan.length]!;
  const stats = makeStats(listing.id, p.base, p.days);
  return {
    listing,
    status: p.status,
    expiresAt:
      p.expiresInDays !== undefined
        ? new Date(TODAY + p.expiresInDays * DAY).toISOString()
        : undefined,
    rejectionReason: p.status === 'rejected' ? 'poor_photos' : undefined,
    stats,
    favourites: Math.round(stats.reduce((s, d) => s + d.views, 0) * 0.03),
  };
});

export function getMyListing(id: number): MyListing | undefined {
  return MY_SAMPLE_LISTINGS.find((m) => m.listing.id === id);
}

export function totals(stats: DailyStat[]) {
  return stats.reduce(
    (t, d) => ({
      views: t.views + d.views,
      phoneReveals: t.phoneReveals + d.phoneReveals,
      whatsappClicks: t.whatsappClicks + d.whatsappClicks,
    }),
    { views: 0, phoneReveals: 0, whatsappClicks: 0 },
  );
}
