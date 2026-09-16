import { test, expect } from '@playwright/test';

test.describe('Homepage Refactor Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Bypass the cinematic intro immediately
    const skipButton = page.locator('text=Skip [esc]');
    if (await skipButton.isVisible()) {
      await skipButton.click();
    } else {
      await page.keyboard.press('Escape');
    }
    // Wait for intro to disappear
    await page.waitForSelector('[aria-label="Cosmic Brand Cinematic Intro"]', { state: 'hidden' });
  });

  test('Navbar should have Collections as primary entry', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toContainText('Collections');
    await expect(header).toContainText('Catalog');
    await expect(header).toContainText('The Maison');
    await expect(header).toContainText('Vault');
  });

  test('Collections Preview should show 5 specific categories', async ({ page }) => {
    const previewSection = page.locator('#collections-preview');
    await expect(previewSection).toBeVisible();

    const categories = ['Rings', 'Necklaces', 'Bracelets', 'Earrings', 'Featured Collections'];
    for (const cat of categories) {
      await expect(previewSection).toContainText(cat);
    }
  });

  test('Featured Pieces should have exactly 4 signature products', async ({ page }) => {
    // Scroll down to the Featured Pieces section
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));

    // Wait for GSAP to potentially load/animate
    await page.waitForTimeout(1000);

    const section = page.locator('section:has-text("The Signature Series")');
    const productNames = section.locator('h4');

    await expect(productNames).toHaveCount(4);
  });

  test('Product overlay should contain name and price', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
    await page.waitForTimeout(1000);

    const firstProduct = page.locator('section:has-text("The Signature Series") .relative.group').first();
    await expect(firstProduct).toBeVisible();

    await expect(firstProduct).toContainText('Lunar Silver Ring');
    await expect(firstProduct).toContainText('₹799');
  });
});
