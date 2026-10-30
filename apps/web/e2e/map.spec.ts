import { expect, test } from '@playwright/test';
import { stubMapTiles } from './helpers';

test.describe('search map view', () => {
  test.beforeEach(async ({ page }) => {
    await stubMapTiles(page);
  });

  test('switching to the map keeps the search and shows clusters', async ({ page }) => {
    await page.goto('/en/buy/residential');
    await page.getByRole('link', { name: 'Map', exact: true }).click();
    await expect(page).toHaveURL(/\/en\/buy\/residential\?view=map$/);
    await expect(
      page.getByRole('region', { name: 'Property map' }).locator('canvas'),
    ).toBeVisible();
    await expect(page.locator('.maplibregl-marker').first()).toBeVisible();
    await expect(page.getByText('Map locations are approximate')).toBeVisible();
  });

  test('clusters zoom in, and a price pin opens a preview linking to the listing', async ({
    page,
  }) => {
    await page.goto('/buy/residential/baghdad/mansour?view=map');
    // Zoom into clusters until individual price pins appear.
    for (let i = 0; i < 4 && (await page.locator('.mahalla-pin').count()) === 0; i++) {
      await page.locator('.maplibregl-marker').first().click();
      await page.waitForTimeout(700);
    }
    const pin = page.locator('.mahalla-pin').first();
    await expect(pin).toBeVisible();
    await pin.click();
    await expect(pin).toHaveAttribute('data-state', 'selected');
    const preview = page
      .locator('article')
      .filter({ has: page.getByRole('button', { name: 'إغلاق المعاينة' }) });
    await expect(preview).toBeVisible();
    await preview.getByRole('heading', { level: 3 }).getByRole('link').click();
    await expect(page).toHaveURL(/\/property\/\d+-/);
  });

  test('filters still apply in map view', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop sidebar');
    await page.goto('/en/rent/residential?view=map');
    await page.getByRole('complementary').getByRole('button', { name: '2', exact: true }).click();
    await expect(page).toHaveURL(/view=map/);
    await expect(page).toHaveURL(/beds=2/);
  });
});
