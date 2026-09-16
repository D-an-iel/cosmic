# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: collections.spec.js >> Collections Page Lookbook Verification >> should have horizontal scroll containers for each chapter
- Location: tests\collections.spec.js:33:3

# Error details

```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 4
Received:    3
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - generic [ref=e6]: Complimentary Express Air Courier
    - generic [ref=e7]: •
    - 'link "Flagship Showroom: Lunar Silver Ring (₹799) →" [ref=e8] [cursor=pointer]':
      - /url: /product/lunar-silver-ring
  - banner [ref=e9]:
    - generic [ref=e10]:
      - navigation [ref=e11]:
        - link "Collections" [ref=e12] [cursor=pointer]:
          - /url: /collections
        - link "Catalog" [ref=e14] [cursor=pointer]:
          - /url: /collections
      - link "Cosmic Haute Joaillerie" [ref=e15] [cursor=pointer]:
        - /url: /
        - generic [ref=e16]: Cosmic
        - generic [ref=e17]: Haute Joaillerie
      - generic [ref=e18]:
        - link "The Maison" [ref=e19] [cursor=pointer]:
          - /url: /#maison
        - button "Login" [ref=e21] [cursor=pointer]
        - link "Private Vault" [ref=e22] [cursor=pointer]:
          - /url: /wishlist
          - generic [ref=e23]: Vault
        - button "Shopping Bag" [ref=e27] [cursor=pointer]:
          - generic [ref=e28]: Bag
          - generic [ref=e29]: "1"
  - generic [ref=e33]:
    - banner [ref=e34]:
      - generic [ref=e35]:
        - generic [ref=e36]: The Archive
        - heading "Collections" [level=1] [ref=e37]
        - paragraph [ref=e38]: A curated discovery of sculptural forms and celestial geometry.
    - main [ref=e39]:
      - generic [ref=e41]:
        - generic [ref=e42]:
          - heading "Rings" [level=2] [ref=e43]
          - generic [ref=e44]: 7 Pieces
        - generic [ref=e46]:
          - link [ref=e48] [cursor=pointer]:
            - /url: /product/nova-eclipse-ring
            - img "Nova Eclipse Ring" [ref=e50]
            - generic [ref=e51]:
              - heading "Nova Eclipse Ring" [level=3] [ref=e52]
              - paragraph [ref=e53]: ₹849
          - link [ref=e55] [cursor=pointer]:
            - /url: /product/lunar-silver-ring
            - img "Lunar Silver Ring" [ref=e57]
            - generic [ref=e58]:
              - heading "Lunar Silver Ring" [level=3] [ref=e59]
              - paragraph [ref=e60]: ₹799
          - link [ref=e62] [cursor=pointer]:
            - /url: /product/solar-crest-ring
            - img "Solar Crest Ring" [ref=e64]
            - generic [ref=e65]:
              - heading "Solar Crest Ring" [level=3] [ref=e66]
              - paragraph [ref=e67]: ₹899
          - link [ref=e69] [cursor=pointer]:
            - /url: /product/cosmic-mechanical-keyboard
            - img "Cosmic Mechanical Keyboard" [ref=e71]
            - generic [ref=e72]:
              - heading "Cosmic Mechanical Keyboard" [level=3] [ref=e73]
              - paragraph [ref=e74]: ₹149.99
          - link [ref=e76] [cursor=pointer]:
            - /url: /product/order-prod
            - img "Cosmic Order Product" [ref=e78]
            - generic [ref=e79]:
              - heading "Cosmic Order Product" [level=3] [ref=e80]
              - paragraph [ref=e81]: ₹100
          - link [ref=e83] [cursor=pointer]:
            - /url: /product/final-prod
            - img "Final Product" [ref=e85]
            - generic [ref=e86]:
              - heading "Final Product" [level=3] [ref=e87]
              - paragraph [ref=e88]: ₹100
          - link [ref=e90] [cursor=pointer]:
            - /url: /product/nebula-band
            - img "Nebula Band" [ref=e92]
            - generic [ref=e93]:
              - heading "Nebula Band" [level=3] [ref=e94]
              - paragraph [ref=e95]: ₹699
      - generic [ref=e97]:
        - generic [ref=e98]:
          - heading "Necklaces" [level=2] [ref=e99]
          - generic [ref=e100]: 3 Pieces
        - generic [ref=e102]:
          - link [ref=e104] [cursor=pointer]:
            - /url: /product/cosmic-signature-pendant
            - img "Cosmic Signature Pendant" [ref=e106]
            - generic [ref=e107]:
              - heading "Cosmic Signature Pendant" [level=3] [ref=e108]
              - paragraph [ref=e109]: ₹1599
          - link [ref=e111] [cursor=pointer]:
            - /url: /product/stellar-chain
            - img "Stellar Chain" [ref=e113]
            - generic [ref=e114]:
              - heading "Stellar Chain" [level=3] [ref=e115]
              - paragraph [ref=e116]: ₹1499
          - link [ref=e118] [cursor=pointer]:
            - /url: /product/celestial-pendant
            - img "Celestial Pendant" [ref=e120]
            - generic [ref=e121]:
              - heading "Celestial Pendant" [level=3] [ref=e122]
              - paragraph [ref=e123]: ₹1299
      - generic [ref=e125]:
        - generic [ref=e126]:
          - heading "Bracelets" [level=2] [ref=e127]
          - generic [ref=e128]: 1 Pieces
        - link [ref=e132] [cursor=pointer]:
          - /url: /product/orbit-bracelet
          - img "Orbit Bracelet" [ref=e134]
          - generic [ref=e135]:
            - heading "Orbit Bracelet" [level=3] [ref=e136]
            - paragraph [ref=e137]: ₹999
  - contentinfo [ref=e138]:
    - generic [ref=e139]:
      - generic [ref=e140]:
        - link "Cosmic" [ref=e141] [cursor=pointer]:
          - /url: /
        - paragraph [ref=e142]: Sculptural fine jewelry and futuristic accessories engineered from solid 925 sterling silver and liquid rhodium. Forged for the modern icon.
        - generic [ref=e143]: Milanese Atelier • Registered Hallmark S925
      - generic [ref=e144]:
        - heading "Maison" [level=4] [ref=e145]
        - list [ref=e146]:
          - listitem [ref=e147]:
            - link "Collections" [ref=e148] [cursor=pointer]:
              - /url: /collections
          - listitem [ref=e149]:
            - link "Catalog" [ref=e150] [cursor=pointer]:
              - /url: /collections
          - listitem [ref=e151]:
            - link "The Maison" [ref=e152] [cursor=pointer]:
              - /url: "#maison"
          - listitem [ref=e153]:
            - link "Vault" [ref=e154] [cursor=pointer]:
              - /url: /wishlist
          - listitem [ref=e155]:
            - link "Contact" [ref=e156] [cursor=pointer]:
              - /url: mailto:concierge@cosmic-maison.com
      - generic [ref=e157]:
        - heading "Social" [level=4] [ref=e158]
        - list [ref=e159]:
          - listitem [ref=e160]:
            - link "Instagram" [ref=e161] [cursor=pointer]:
              - /url: https://instagram.com
          - listitem [ref=e162]:
            - link "X (Twitter)" [ref=e163] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e164]:
            - link "Pinterest" [ref=e165] [cursor=pointer]:
              - /url: "#"
      - generic [ref=e166]:
        - heading "Legal" [level=4] [ref=e167]
        - list [ref=e168]:
          - listitem [ref=e169]:
            - link "Terms of Service" [ref=e170] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e171]:
            - link "Privacy Policy" [ref=e172] [cursor=pointer]:
              - /url: "#"
          - listitem [ref=e173]:
            - link "Authenticity Certificate" [ref=e174] [cursor=pointer]:
              - /url: "#"
    - generic [ref=e175]:
      - generic [ref=e176]: © 2026 COSMIC HAUTE JOAILLERIE S.P.A. ALL RIGHTS RESERVED.
      - generic [ref=e177]:
        - generic [ref=e178]: Newsletter Subscription
        - link "Unsubscribe" [ref=e179] [cursor=pointer]:
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
  29 |       await expect(heading).toBeVisible();
  30 |     }
  31 |   });
  32 | 
  33 |   test('should have horizontal scroll containers for each chapter', async ({ page }) => {
  34 |     // Target overflow-x-auto inside the main content area
  35 |     const scrollContainers = page.locator('main .overflow-x-auto');
  36 |     const count = await scrollContainers.count();
> 37 |     expect(count).toBeGreaterThanOrEqual(4);
     |                   ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
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