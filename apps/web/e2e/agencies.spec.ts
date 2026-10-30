import { expect, test } from '@playwright/test';
import { stubMapTiles } from './helpers';

test.describe('agencies directory', () => {
  test('lists agencies and filters by city', async ({ page }) => {
    await page.goto('/en/agencies');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Real estate agencies in Iraq',
    );
    await expect(page.getByText('6 agencies')).toBeVisible();
    await page.getByRole('link', { name: 'Erbil', exact: true }).click();
    await expect(page).toHaveURL(/city=erbil/);
    await expect(page.getByText('1 agency')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Citadel Homes' })).toBeVisible();
  });

  test('searches agency names in Arabic, ignoring spelling variants', async ({ page }) => {
    await page.goto('/agencies');
    await page.getByLabel('ابحث عن مكتب').fill('الفيحاء');
    await page.getByRole('button', { name: 'بحث' }).click();
    await expect(page.getByText('مكتب واحد')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'الفيحاء العقارية' })).toBeVisible();
  });

  test('header link opens the directory', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop nav');
    await page.goto('/');
    await page.getByRole('banner').getByRole('link', { name: 'المكاتب العقارية' }).click();
    await expect(page).toHaveURL(/\/agencies$/);
  });
});

test.describe('agency profile', () => {
  test.beforeEach(async ({ page }) => {
    await stubMapTiles(page);
  });

  test('shows profile, stats, listings tabs and team', async ({ page }) => {
    await page.goto('/en/agencies/al-nakheel-properties');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Al-Nakheel Properties');
    await expect(page.getByText('Established 2009')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Our team' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Ahmed Al-Jubouri' })).toBeVisible();

    const listings = page.locator('section[aria-labelledby="listings"]');
    await listings.getByRole('link', { name: /For rent/ }).click();
    await expect(page).toHaveURL(/tab=rent/);
    await expect(listings.locator('article').first()).toContainText(/month|year/);
  });

  test('opens from a property page and back to its listings', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop contact card');
    await page.goto('/en/agencies/dar-al-salam-real-estate');
    await page.locator('section[aria-labelledby="listings"] article h3 a').first().click();
    await expect(page).toHaveURL(/\/en\/property\//);
    await page.getByRole('complementary').getByRole('link', { name: 'View agency' }).click();
    await expect(page).toHaveURL(/\/en\/agencies\/dar-al-salam-real-estate$/);
  });

  test('agent contact uses sample-mode notice', async ({ page }) => {
    await page.goto('/agencies/citadel-homes-erbil');
    const team = page.locator('section[aria-labelledby="team"]');
    await team.getByRole('button', { name: 'واتساب' }).first().click();
    await expect(page.getByRole('dialog', { name: 'إعلان تجريبي' })).toBeVisible();
  });

  test('unknown agencies are 404; register page exists', async ({ page }) => {
    expect((await page.goto('/agencies/does-not-exist'))?.status()).toBe(404);
    await page.goto('/en/agencies/register');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Register your agency');
  });
});
