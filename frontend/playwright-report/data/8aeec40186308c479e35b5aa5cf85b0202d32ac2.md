# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: collections.spec.js >> Collections Page Lookbook Verification >> should render all collection chapters
- Location: tests\collections.spec.js:24:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('main h2:has-text("Earrings")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('main h2:has-text("Earrings")') with timeout 5000ms
  - waiting for locator('main h2:has-text("Earrings")')

```

```yaml
- text: Complimentary Express Air Courier •
- 'link "Flagship Showroom: Lunar Silver Ring (₹799) →"':
  - /url: /product/lunar-silver-ring
- banner:
  - navigation:
    - link "Collections":
      - /url: /collections
    - link "Catalog":
      - /url: /collections
  - link "Cosmic Haute Joaillerie":
    - /url: /
  - link "The Maison":
    - /url: /#maison
  - button "Login"
  - link "Private Vault":
    - /url: /wishlist
    - text: Vault
    - img
  - button "Shopping Bag":
    - text: Bag
    - img
    - text: "1"
- banner:
  - text: The Archive
  - heading "Collections" [level=1]
  - paragraph: A curated discovery of sculptural forms and celestial geometry.
- main:
  - heading "Rings" [level=2]
  - text: 7 Pieces
  - link "Nova Eclipse Ring Nova Eclipse Ring ₹849":
    - /url: /product/nova-eclipse-ring
    - img "Nova Eclipse Ring"
    - heading "Nova Eclipse Ring" [level=3]
    - paragraph: ₹849
  - link "Lunar Silver Ring Lunar Silver Ring ₹799":
    - /url: /product/lunar-silver-ring
    - img "Lunar Silver Ring"
    - heading "Lunar Silver Ring" [level=3]
    - paragraph: ₹799
  - link "Solar Crest Ring Solar Crest Ring ₹899":
    - /url: /product/solar-crest-ring
    - img "Solar Crest Ring"
    - heading "Solar Crest Ring" [level=3]
    - paragraph: ₹899
  - link "Cosmic Mechanical Keyboard Cosmic Mechanical Keyboard ₹149.99":
    - /url: /product/cosmic-mechanical-keyboard
    - img "Cosmic Mechanical Keyboard"
    - heading "Cosmic Mechanical Keyboard" [level=3]
    - paragraph: ₹149.99
  - link "Cosmic Order Product Cosmic Order Product ₹100":
    - /url: /product/order-prod
    - img "Cosmic Order Product"
    - heading "Cosmic Order Product" [level=3]
    - paragraph: ₹100
  - link "Final Product Final Product ₹100":
    - /url: /product/final-prod
    - img "Final Product"
    - heading "Final Product" [level=3]
    - paragraph: ₹100
  - link "Nebula Band Nebula Band ₹699":
    - /url: /product/nebula-band
    - img "Nebula Band"
    - heading "Nebula Band" [level=3]
    - paragraph: ₹699
  - heading "Necklaces" [level=2]
  - text: 3 Pieces
  - link "Cosmic Signature Pendant Cosmic Signature Pendant ₹1599":
    - /url: /product/cosmic-signature-pendant
    - img "Cosmic Signature Pendant"
    - heading "Cosmic Signature Pendant" [level=3]
    - paragraph: ₹1599
  - link "Stellar Chain Stellar Chain ₹1499":
    - /url: /product/stellar-chain
    - img "Stellar Chain"
    - heading "Stellar Chain" [level=3]
    - paragraph: ₹1499
  - link "Celestial Pendant Celestial Pendant ₹1299":
    - /url: /product/celestial-pendant
    - img "Celestial Pendant"
    - heading "Celestial Pendant" [level=3]
    - paragraph: ₹1299
  - heading "Bracelets" [level=2]
  - text: 1 Pieces
  - link "Orbit Bracelet Orbit Bracelet ₹999":
    - /url: /product/orbit-bracelet
    - img "Orbit Bracelet"
    - heading "Orbit Bracelet" [level=3]
    - paragraph: ₹999
- contentinfo:
  - link "Cosmic":
    - /url: /
  - paragraph: Sculptural fine jewelry and futuristic accessories engineered from solid 925 sterling silver and liquid rhodium. Forged for the modern icon.
  - text: Milanese Atelier • Registered Hallmark S925
  - heading "Maison" [level=4]
  - list:
    - listitem:
      - link "Collections":
        - /url: /collections
    - listitem:
      - link "Catalog":
        - /url: /collections
    - listitem:
      - link "The Maison":
        - /url: "#maison"
    - listitem:
      - link "Vault":
        - /url: /wishlist
    - listitem:
      - link "Contact":
        - /url: mailto:concierge@cosmic-maison.com
  - heading "Social" [level=4]
  - list:
    - listitem:
      - link "Instagram":
        - /url: https://instagram.com
    - listitem:
      - link "X (Twitter)":
        - /url: "#"
    - listitem:
      - link "Pinterest":
        - /url: "#"
  - heading "Legal" [level=4]
  - list:
    - listitem:
      - link "Terms of Service":
        - /url: "#"
    - listitem:
      - link "Privacy Policy":
        - /url: "#"
    - listitem:
      - link "Authenticity Certificate":
        - /url: "#"
  - text: © 2026 COSMIC HAUTE JOAILLERIE S.P.A. ALL RIGHTS RESERVED. Newsletter Subscription
  - link "Unsubscribe":
    - /url: /
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Collections Page Lookbook Verification', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/collections');
  6  | 
  7  |     // Bypass the cinematic intro if it exists
  8  |     const skipButton = page.locator('text=Skip [esc]');
  9  |     if (await skipButton.isVisible()) {
  10 |       await skipButton.click();
  11 |     } else {
  12 |       await page.keyboard.press('Escape');
  13 |     }
  14 | 
  15 |     // Wait for the main content to be visible
  16 |     await page.waitForSelector('h1', { state: 'visible' });
  17 |   });
  18 | 
  19 |   test('should render the editorial header', async ({ page }) => {
  20 |     await expect(page.locator('h1')).toContainText('Collections');
  21 |     await expect(page.locator('text=The Archive')).toBeVisible();
  22 |   });
  23 | 
  24 |   test('should render all collection chapters', async ({ page }) => {
  25 |     const chapters = ['Rings', 'Necklaces', 'Bracelets', 'Earrings'];
  26 |     for (const chapter of chapters) {
  27 |       // Target h2 inside the main content area to avoid navbar
  28 |       const heading = page.locator('main h2:has-text("' + chapter + '")');
> 29 |       await expect(heading).toBeVisible();
     |                             ^ Error: expect(locator).toBeVisible() failed
  30 |     }
  31 |   });
  32 | 
  33 |   test('should have horizontal scroll containers for each chapter', async ({ page }) => {
  34 |     // Target overflow-x-auto inside the main content area
  35 |     const scrollContainers = page.locator('main .overflow-x-auto');
  36 |     const count = await scrollContainers.count();
  37 |     expect(count).toBeGreaterThanOrEqual(4);
  38 |   });
  39 | 
  40 |   test('product cards should have minimal info (Name and Price)', async ({ page }) => {
  41 |     // Target a product card specifically inside the gallery
  42 |     const firstProduct = page.locator('main .group').first();
  43 |     await expect(firstProduct).toBeVisible();
  44 | 
  45 |     // Should contain price symbol
  46 |     await expect(firstProduct).toContainText('₹');
  47 | 
  48 |     // Should NOT contain buttons
  49 |     const button = firstProduct.locator('button');
  50 |     await expect(button).toHaveCount(0);
  51 |   });
  52 | 
  53 |   test('clicking a product should navigate to product details', async ({ page }) => {
  54 |     const firstProductLink = page.locator('main a').filter({ hasText: '₹' }).first();
  55 |     await firstProductLink.click();
  56 | 
  57 |     // Verify URL changes to /product/...
  58 |     await expect(page).toHaveURL(/\/product\/.+/);
  59 |   });
  60 | });
  61 | 
```