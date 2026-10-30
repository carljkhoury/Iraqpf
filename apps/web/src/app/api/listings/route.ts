import { NextResponse } from 'next/server';
import { SAMPLE_LISTINGS } from '@/lib/sample-data';

/**
 * GET /api/listings?ids=1,2,3 — card data for saved and recently viewed
 * listings (kept in the browser in Phase 2). Becomes part of the API in Phase 3.
 */
export function GET(request: Request) {
  const ids = (new URL(request.url).searchParams.get('ids') ?? '')
    .split(',')
    .map(Number)
    .filter(Number.isInteger)
    .slice(0, 100);
  const byId = new Map(SAMPLE_LISTINGS.map((l) => [l.id, l]));
  return NextResponse.json(ids.map((id) => byId.get(id)).filter(Boolean));
}
