import { expect, test } from '@playwright/test';

test.describe('search results', () => {
  test('header navigation opens localized results', async ({ page, isMobile }) => {
    await page.goto('/en');
    if (isMobile) {
      await page.getByRole('button', { name: 'Menu' }).click();
      await page.getByRole('dialog').getByRole('link', { name: 'Rent', exact: true }).click();
    } else {
      await page.getByRole('banner').getByRole('link', { name: 'Rent', exact: true }).click();
    }
    await expect(page).toHaveURL(/\/en\/rent\/residential$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Residential properties for rent in Iraq',
    );
    await expect(page.locator('article').first()).toBeVisible();
  });

  test('Arabic title includes the area and governorate', async ({ page }) => {
    await page.goto('/buy/apartments/baghdad/karrada');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('شقق للبيع في الكرادة، بغداد');
    await expect(page.getByRole('navigation', { name: 'مسار التنقل' })).toContainText('بغداد');
  });

  test('/buy redirects to residential results', async ({ page }) => {
    await page.goto('/en/buy');
    await expect(page).toHaveURL(/\/en\/buy\/residential$/);
  });

  test('unknown locations return 404', async ({ page }) => {
    const response = await page.goto('/buy/apartments/baghdad/atlantis');
    expect(response?.status()).toBe(404);
  });

  test('shows an empty state with a way back', async ({ page }) => {
    await page.goto('/en/buy/hotels');
    await expect(page.getByText('No properties match your search')).toBeVisible();
    await page.getByRole('link', { name: 'Clear all' }).click();
    await expect(page).toHaveURL(/\/en\/buy\/hotels$/);
  });

  test('sorting, list view and pagination are reflected in the URL', async ({ page, isMobile }) => {
    test.skip(isMobile, 'view toggle is desktop only');
    await page.goto('/en/buy/properties');
    await page.getByLabel('Sort by').selectOption('price_asc');
    await expect(page).toHaveURL(/sort=price_asc/);

    await page.getByRole('link', { name: 'List', exact: true }).click();
    await expect(page).toHaveURL(/view=list/);
    await expect(page.locator('article').first().getByRole('heading', { level: 3 })).toBeVisible();

    await page.getByRole('link', { name: 'Page 2' }).click();
    await expect(page).toHaveURL(/page=2/);
    await expect(page).toHaveURL(/sort=price_asc/);
  });
});

test.describe('filters', () => {
  test('desktop: bedroom and purpose filters update results', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop sidebar');
    await page.goto('/en/buy/residential');
    const sidebar = page.getByRole('complementary');
    await sidebar.getByRole('button', { name: '3', exact: true }).click();
    await expect(page).toHaveURL(/beds=3/);
    for (const facts of await page.locator('article ul').allTextContents()) {
      expect(facts).toContain('3 beds');
    }

    await sidebar.getByRole('button', { name: 'Rent', exact: true }).click();
    await expect(page).toHaveURL(/\/en\/rent\/residential\?beds=3/);
  });

  test('desktop: choosing a location narrows the search', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop sidebar');
    await page.goto('/buy/residential');
    const sidebar = page.getByRole('complementary');
    await sidebar.getByRole('combobox', { name: 'الموقع' }).fill('اربيل');
    await page.getByRole('option', { name: /أربيل/ }).first().click();
    await expect(page).toHaveURL(/\/buy\/residential\/erbil$/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('عقارات سكنية للبيع في أربيل');
  });

  test('mobile: filter sheet applies filters and shows the live count', async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, 'mobile sheet');
    await page.goto('/rent/residential');
    await page.getByRole('button', { name: /الفلاتر/ }).click();
    const sheet = page.getByRole('dialog');
    await sheet.getByRole('button', { name: '2', exact: true }).click();
    await expect(page).toHaveURL(/beds=2/);
    await sheet.getByRole('button', { name: /عرض|لا توجد/ }).click();
    await expect(sheet).toBeHidden();
    await expect(page.getByRole('button', { name: /الفلاتر/ })).toContainText('1');
  });
});
