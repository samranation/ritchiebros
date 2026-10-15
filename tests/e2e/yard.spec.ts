import { test, expect } from '../../helpers/e2e/fixtures';

test.describe('Scenario 3: Edmonton yard page', () => {
  test.beforeEach(async ({ yardPage }) => {
    await yardPage.goto();
    await expect(yardPage.heading).toBeVisible();
  });

  test('3.1 details: address, office hours, telephone', async ({ yardPage }) => {
    await expect(yardPage.main).toContainText(/1500 Sparrow Drive, Nisku, AB/);
    await expect(yardPage.main).toContainText(/T9E 8H6/);
    await expect(yardPage.main).toContainText('Mon - Fri, 08:00 AM - 05:00 PM');
    await expect(yardPage.sellerForm).toBeVisible();
  });

  test('3.2 auction events', async ({ yardPage }) => {
    await expect(yardPage.auctionEventsHeading).toBeVisible();
    const count = await yardPage.eventCards.count();
    expect(count).toBeGreaterThanOrEqual(1);

    for (const card of await yardPage.eventCards.all()) {
      await expect(yardPage.eventDateRange(card)).toHaveText(/^[A-Z][a-z]{2} \d{1,2}\s*-\s*[A-Z][a-z]{2} \d{1,2}$/);
      await expect(yardPage.eventTitle(card)).toContainText(/Edmonton|AB|CAN/);
    }
  });

  test('3.3 about this yard', async ({ yardPage }) => {
    await expect(yardPage.aboutHeading).toBeVisible();
    await expect(yardPage.aboutNotice).toBeVisible();
    await expect(yardPage.aboutNotice).toContainText(/open weekdays for equipment drop-off, inspection and pick-up/i); // ignoring case
  });

  test('3.4 items in yard carousel', async ({ yardPage }) => {
    await expect(yardPage.itemsInYardHeading).toBeVisible();
    const cards = await yardPage.categoryCardContents();
    expect(cards.length).toBeGreaterThan(5);

    for (const card of cards) {
      expect(card.name).toMatch(/\S/);
      expect(card.quantity, JSON.stringify(card)).toMatch(/^[\d,]+ items?$/); // checks number e.g. "quantity":"50 items"
    }
    const names = cards.map((c) => c.name);
    expect(names).toContain('Excavators');
    const items = ['Harvesting Equipment', 'Agricultural Tractors', 'Sprayers', 'Excavator Attachments'];
    expect(names.some((name) => items.includes(name))).toBe(true);
  });

  test('3.5 become a seller call to action is visible with a phone number ', async ({ yardPage }) => {
    await yardPage.becomeSellerHeading.scrollIntoViewIfNeeded();
    await expect(yardPage.becomeSellerHeading).toBeVisible();
    await expect(yardPage.sellerForm).toBeVisible();
    await expect(yardPage.sellerForm.getByRole('button', { name: 'Submit' })).toBeVisible();
    await expect(yardPage.sellerForm).toBeVisible();
    await expect(yardPage.sellerPhone).toBeVisible();
  });

  test('3.6 representatives tab', async ({ yardPage }) => {
    await yardPage.representativesTab.click();
    await expect(yardPage.representativeNames.first()).toBeVisible();
    const count = await yardPage.representativeNames.count();
    expect(count).toBeGreaterThanOrEqual(1);
    const [first] = await yardPage.representatives();
    expect(first.territory).toMatch(/\S/);
    expect(first.contact, JSON.stringify(first)).toMatch(/\S/);
  });
});
