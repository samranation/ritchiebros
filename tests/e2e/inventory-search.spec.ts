import { test, expect } from '../../helpers/e2e/fixtures';

test.describe('Scenario 4: Edmonton inventory search', () => {
  test('4.1 + 4.2 search results show a total and lot titles', async ({ page, searchPage }) => {
    await searchPage.goto('Edmonton');
    await searchPage.waitForResults();

    await test.step('4.1 query context is Edmonton', async () => {
      await expect(page).toHaveURL(/freeText=Edmonton/);
      await expect(searchPage.searchBox).toHaveValue('Edmonton');
    })

    await test.step('4.2 displayed total', async () => {
      const total = await searchPage.displayedTotal();
      expect(total).toBeGreaterThan(0);
      console.log("displayed total: " + total);

      await test.step('every lot on the first page has a title', async () => {
        const titles = (await searchPage.titles.allInnerTexts()).map((title) => title.trim());
        expect(titles.length).toBeGreaterThan(0);
        expect(titles, 'one title per card').toHaveLength(await searchPage.cards.count());
        for (const title of titles) expect(title).toMatch(/\S/);
        console.log('first 5 titles:', titles.slice(0, 5));
      });

      await test.step('location / closing date, where shown, is non-empty', async () => {
        const locations = (await searchPage.locations.allInnerTexts()).map((t) => t.trim());
        const closingDates = (await searchPage.closingDates.allInnerTexts()).map((t) => t.trim());
        expect(locations.length + closingDates.length).toBeGreaterThan(0);
        for (const location of locations) expect(location).toMatch(/\S/);
        for (const date of closingDates) expect(date.slice(date.indexOf(':') + 1).trim()).not.toBe('');
      })
    })
  });
});
