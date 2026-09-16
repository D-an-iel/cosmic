import { test, expect } from '@playwright/test';

test.describe('Collections Page Lookbook Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/collections');

    // Bypass the cinematic intro if it exists
    const skipButton = page.locator('text=Skip [esc]');
    if (await skipButton.isVisible()) {
      await skipButton.click();
    } else {
      await page.keyboard.press('Escape');
    }

    // Wait for the main content to be visible
    await page.waitForSelector('h1', { state: 'visible' });
  });

  test('should render the editorial header', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Collections');
    await expect(page.locator('text=The Archive')).toBeVisible();
  });

  test('should render all collection chapters', async ({ page }) => {
    const chapters = ['Rings', 'Necklaces', 'Bracelets', 'Earrings'];
    for (const chapter of chapters) {
      // Target h2 inside the main content area to avoid navbar
      const heading = page.locator('main h2:has-text("' + chapter + '")');
      await expect(heading).toBeVisible();
    }
  });

  test('should have horizontal scroll containers for each chapter', async ({ page }) => {
    // Target overflow-x-auto inside the main content area
    const scrollContainers = page.locator('main .overflow-x-auto');
    const count = await scrollContainers.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('product cards should have minimal info (Name and Price)', async ({ page }) => {
    // Target a product card specifically inside the gallery
    const firstProduct = page.locator('main .group').first();
    await expect(firstProduct).toBeVisible();

    // Should contain price symbol
    await expect(firstProduct).toContainText('₹');

    // Should NOT contain buttons
    const button = firstProduct.locator('button');
    await expect(button).toHaveCount(0);
  });

  test('clicking a product should navigate to product details', async ({ page }) => {
    const firstProductLink = page.locator('main a').filter({ hasText: '₹' }).first();
    await firstProductLink.click();

    // Verify URL changes to /product/...
    await expect(page).toHaveURL(/\/product\/.+/);
  });
});
