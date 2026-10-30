import { expect, test } from '@playwright/test';
import { firstHousePath, stubMapTiles } from './helpers';

let PATH = '';

test.describe('property details', () => {
  test.beforeEach(async ({ page }) => {
    await stubMapTiles(page);
    PATH ||= await firstHousePath(page);
  });

  test('opens from a search result card', async ({ page }) => {
    await page.goto('/en/buy/houses');
    const first = page.locator('article').first();
    const title = await first.getByRole('heading', { level: 3 }).textContent();
    await first.getByRole('heading', { level: 3 }).getByRole('link').click();
    await expect(page).toHaveURL(/\/en\/property\/\d+-/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(title).toBeTruthy();
  });

  test('shows price, key facts, details and similar properties in Arabic', async ({ page }) => {
    await page.goto(PATH);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('بيت');
    await expect(page.getByRole('heading', { name: 'تفاصيل العقار' })).toBeVisible();
    await expect(page.getByText('رقم الإعلان')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'عقارات مشابهة' })).toBeVisible();
  });

  test('old URLs redirect to the current slug; unknown IDs are 404', async ({ page }) => {
    const id = PATH.match(/\/property\/(\d+)-/)![1];
    await page.goto(`/en/property/${id}-some-old-title`);
    await expect(page).toHaveURL(new RegExp(`/en${PATH}$`));
    const response = await page.goto('/property/999-nothing');
    expect(response?.status()).toBe(404);
  });

  test('includes structured data for search engines', async ({ page }) => {
    await page.goto(`/en${PATH}`);
    const json = await page.locator('script[type="application/ld+json"]').textContent();
    const data = JSON.parse(json ?? '{}');
    expect(data['@type']).toBe('RealEstateListing');
    expect(data.offers.priceCurrency).toMatch(/USD|IQD/);
  });

  test('gallery opens full screen and moves between photos', async ({ page, isMobile }) => {
    await page.goto(`/en${PATH}`);
    if (isMobile)
      await page
        .getByRole('button', { name: /Photo 1 of/ })
        .first()
        .click();
    else await page.getByRole('button', { name: /Show all photos/ }).click();
    const viewer = page.getByRole('dialog');
    await expect(viewer).toContainText('1 / 4');
    await viewer.getByRole('button', { name: 'Next photo' }).click();
    await expect(viewer).toContainText('2 / 4');
    await page.keyboard.press('ArrowLeft');
    await expect(viewer).toContainText('1 / 4');
    await page.keyboard.press('Escape');
    await expect(viewer).toBeHidden();
  });

  test('desktop: reveal number, then sample-mode notice instead of calling', async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, 'desktop contact card');
    await page.goto(`/en${PATH}`);
    const card = page.getByRole('complementary');
    await card.getByRole('button', { name: 'Show number' }).click();
    const call = card.getByRole('button', { name: /07\d\d \d{3} \d{4}/ });
    await expect(call).toBeVisible();
    await call.click();
    await expect(page.getByRole('dialog', { name: 'Sample listing' })).toBeVisible();
  });

  test('mobile: sticky WhatsApp button explains sample mode', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile bar');
    await page.goto(PATH);
    await page.getByRole('button', { name: 'واتساب' }).last().click();
    await expect(page.getByRole('dialog', { name: 'إعلان تجريبي' })).toBeVisible();
  });

  test('shows the approximate area on a map, not an exact pin', async ({ page }) => {
    await page.goto(`/en${PATH}`);
    const map = page.getByRole('region', { name: 'Approximate area of the property' });
    await map.scrollIntoViewIfNeeded();
    await expect(map.locator('canvas')).toBeVisible();
    await expect(page.locator('.maplibregl-marker')).toHaveCount(0);
  });

  test('report form requires a reason and confirms', async ({ page }) => {
    await page.goto(`/en${PATH}`);
    await page.getByRole('button', { name: 'Report this listing' }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Send report' }).click();
    await expect(dialog.getByText('Choose a reason').last()).toBeVisible();
    await dialog.getByLabel('Wrong price').check();
    await dialog.getByRole('button', { name: 'Send report' }).click();
    await expect(dialog).toContainText('Thank you');
  });
});
