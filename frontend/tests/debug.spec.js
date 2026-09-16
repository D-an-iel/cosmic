import { test, expect } from '@playwright/test';

test.describe('Homepage Refactor Debug', () => {
  test('Page Content Debug', async ({ page }) => {
    page.on('console', msg => console.log(`BROWSER CONSOLE: ${msg.text()}`));
    page.on('pageerror', err => console.log(`BROWSER ERROR: ${err.message}`));

    await page.goto('/');

    try {
      await page.waitForSelector('#root > div', { timeout: 10000 });
    } catch (e) {
      console.log('TIMEOUT WAITING FOR ROOT DIV');
    }

    console.log('PAGE CONTENT:');
    console.log(await page.content());
  });
});
