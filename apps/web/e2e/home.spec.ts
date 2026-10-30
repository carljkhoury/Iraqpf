import { expect, test } from '@playwright/test';

test.describe('homepage', () => {
  test('Arabic is the default, right-to-left', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('ابحث عن بيتك في محلّتك');
  });

  test('English lives under /en, left-to-right', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Find your home in your mahalla',
    );
  });

  test('declares hreflang alternates for search engines', async ({ page }) => {
    await page.goto('/en');
    await expect(page.locator('link[rel="alternate"][hreflang="ar"]')).toHaveAttribute(
      'href',
      /^https?:\/\/[^/]+\/?$/,
    );
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      'href',
      /\/en$/,
    );
  });

  for (const path of ['/', '/en']) {
    test(`has no horizontal scrolling on ${path}`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('renders Arabic prices with Western digits and an Arabic currency', async ({ page }) => {
    await page.goto('/');
    const price = page.locator('article').first().locator('p').first();
    await expect(price).toHaveText(/[\d,]+ (د\.ع|\$)/);
  });

  test('is hidden from search engines before launch', async ({ page, request }) => {
    const response = await request.get('/');
    expect(response.headers()['x-robots-tag']).toContain('noindex');
    await page.goto('/');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('Disallow: /');
  });
});

test.describe('language switcher', () => {
  test('switches between Arabic and English on the same page', async ({ page, isMobile }) => {
    await page.goto('/');
    if (isMobile) {
      await page.getByRole('button', { name: 'القائمة' }).click();
      await page.getByRole('dialog').getByRole('link', { name: 'التبديل إلى الإنكليزية' }).click();
    } else {
      await page.getByRole('banner').getByRole('link', { name: 'التبديل إلى الإنكليزية' }).click();
    }
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');

    await page.getByRole('contentinfo').getByRole('link', { name: 'Switch to Arabic' }).click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page).not.toHaveURL(/\/en/);
  });
});

test.describe('hero search', () => {
  test('finds an Arabic area despite spelling variants and builds the search URL', async ({
    page,
  }) => {
    await page.goto('/');
    const location = page.getByRole('combobox', { name: 'الموقع' });
    await location.fill('الكراده');
    await page
      .getByRole('option', { name: /الكرادة/ })
      .first()
      .click();
    await expect(location).toHaveValue('الكرادة');
    await page.getByRole('search').getByRole('button', { name: 'بحث' }).click();
    await expect(page).toHaveURL(/\/buy\/residential\/baghdad\/karrada$/);
  });

  test('commercial rent search in English with keyboard selection', async ({ page }) => {
    await page.goto('/en');
    await page.getByRole('button', { name: 'Commercial' }).click();
    await page.getByRole('combobox', { name: 'Location' }).fill('ankaw');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('Enter');
    await page.locator('#hero-type').selectOption('office');
    await page.getByRole('search').getByRole('button', { name: 'Search' }).click();
    await expect(page).toHaveURL(/\/en\/rent\/offices\/erbil\/ankawa$/);
  });
});

test.describe('favourites', () => {
  test('saving a property persists across reloads', async ({ page }) => {
    await page.goto('/en');
    const save = page.getByRole('button', { name: 'Save to favourites' }).first();
    await save.click();
    await expect(
      page.getByRole('button', { name: 'Remove from favourites' }).first(),
    ).toHaveAttribute('aria-pressed', 'true');
    await page.reload();
    await expect(page.getByRole('button', { name: 'Remove from favourites' })).toHaveCount(1);
  });
});

test.describe('mobile menu', () => {
  test('opens from the end side and lists the main navigation', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'mobile only');
    await page.goto('/');
    await page.getByRole('button', { name: 'القائمة' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('link', { name: 'إيجار' })).toBeVisible();
    await expect(dialog.getByRole('link', { name: 'أضف عقارك' })).toBeVisible();
    await dialog.getByRole('button', { name: 'إغلاق' }).click();
    await expect(dialog).toBeHidden();
  });
});
