import type { Page } from '@playwright/test';

/** Minimal map style so tests never depend on the external tile server. */
const STUB_STYLE = {
  version: 8,
  sources: {},
  layers: [{ id: 'background', type: 'background', paint: { 'background-color': '#e9eef5' } }],
};

export async function stubMapTiles(page: Page) {
  await page.route('https://tiles.openfreemap.org/**', (route) =>
    route.fulfill({ json: STUB_STYLE }),
  );
}

/** Path (without locale prefix) of the first house for sale in the sample data. */
export async function firstHousePath(page: Page): Promise<string> {
  await page.goto('/en/buy/houses');
  const href = await page.locator('article h3 a').first().getAttribute('href');
  if (!href) throw new Error('No listing found');
  return href.replace(/^\/en/, '');
}
