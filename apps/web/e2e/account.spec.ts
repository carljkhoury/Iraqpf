import { type Page, expect, test } from '@playwright/test';

async function signIn(page: Page, next = '/en/account') {
  await page.goto(`/en/login?next=${encodeURIComponent(next.replace(/^\/en/, ''))}`);
  await page.getByLabel('Mobile number').fill('0770 123 4567');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByLabel('Verification code').fill('123456');
  await page.getByRole('button', { name: 'Verify' }).click();
  await page.getByLabel('Name').fill('Karrar Hassan');
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page).toHaveURL(new RegExp(`${next}$`));
}

test.describe('sign in', () => {
  test('rejects an invalid number and a wrong code', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('رقم الموبايل').fill('12345');
    await page.getByRole('button', { name: 'متابعة' }).click();
    await expect(page.getByText('أدخل رقم موبايل عراقي صحيح')).toBeVisible();
    await page.getByLabel('رقم الموبايل').fill('٠٧٨٠١٢٣٤٥٦٧');
    await page.getByRole('button', { name: 'متابعة' }).click();
    await expect(page.getByText('0780 123 4567')).toBeVisible();
    await page.getByLabel('رمز التحقق').fill('000000');
    await page.getByRole('button', { name: 'تحقق' }).click();
    await expect(page.getByText('الرمز غير صحيح')).toBeVisible();
  });

  test('account pages ask visitors to sign in, then return them', async ({ page }) => {
    await page.goto('/en/account/favourites');
    await expect(page.getByRole('heading', { name: 'Log in to continue' })).toBeVisible();
    await page.getByRole('main').getByRole('link', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/\/en\/login\?next=%2Faccount%2Ffavourites/);
  });

  test('full sign-in, header shows the account, sign out', async ({ page, isMobile }) => {
    await signIn(page);
    await expect(page.getByRole('heading', { name: 'Hello, Karrar Hassan' })).toBeVisible();
    if (!isMobile)
      await expect(
        page.getByRole('banner').getByRole('link', { name: /My account/ }),
      ).toBeVisible();
    await page.getByRole('button', { name: 'Log out' }).first().click();
    await expect(page).toHaveURL(/\/en$/);
  });
});

test.describe('account area', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test('my listings: pause, resume and delete with confirmation', async ({ page }) => {
    await page.goto('/en/account/listings');
    const first = page.locator('main li').filter({ hasText: 'Active' }).first();
    const title = await first.locator('h3').textContent();
    await first.getByRole('button', { name: 'Pause' }).click();
    await expect(page.getByText('Listing paused').first()).toBeVisible();
    const paused = page.locator('main li').filter({ hasText: title! });
    await expect(paused).toContainText('Paused');
    await paused.getByRole('button', { name: 'Resume' }).click();
    await expect(paused).toContainText('Active');

    await paused.getByRole('button', { name: 'Delete' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
    await expect(page.locator('main li').filter({ hasText: title! })).toHaveCount(0);
    await page.reload();
    await expect(page.locator('main li').filter({ hasText: title! })).toHaveCount(0);
  });

  for (const path of ['/en/account', '/account/listings', '/en/account/settings']) {
    test(`no horizontal scrolling on ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(
        page.getByRole('navigation', { name: /Account menu|قائمة الحساب/ }),
      ).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('listing statistics show totals and a chart with a table view', async ({ page }) => {
    await page.goto('/en/account/listings');
    await page.getByRole('link', { name: 'Statistics' }).first().click();
    await expect(page.getByRole('heading', { name: 'Listing performance' })).toBeVisible();
    await expect(page.getByRole('img', { name: 'Views per day' })).toBeVisible();
    await page.getByText('Show data as a table').click();
    await expect(page.locator('table tbody tr')).toHaveCount(30);
  });

  test('saved and recently viewed properties appear in the account', async ({ page }) => {
    await page.goto('/en/buy/houses');
    await page.getByRole('button', { name: 'Save to favourites' }).first().click();
    await page.locator('article h3 a').nth(1).click();
    await expect(page).toHaveURL(/\/en\/property\//);
    const viewed = await page.getByRole('heading', { level: 1 }).textContent();

    await page.goto('/en/account/favourites');
    await expect(page.locator('article')).toHaveCount(1);
    await page.goto('/en/account/recent');
    await expect(page.locator('article').first()).toContainText(viewed!.split(' in ')[1]!);
  });

  test('settings validate and save', async ({ page }) => {
    await page.goto('/en/account/settings');
    await page.getByLabel('Email (optional)').fill('not-an-email');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Enter a valid email address')).toBeVisible();
    await page.getByLabel('Email (optional)').fill('karrar@example.com');
    await page.getByLabel('Independent broker').check();
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Saved' })).toBeVisible();
    await page.reload();
    await expect(page.getByLabel('Email (optional)')).toHaveValue('karrar@example.com');
    await expect(page.getByLabel('Independent broker')).toBeChecked();
  });
});
