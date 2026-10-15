import { test, expect } from '../../helpers/e2e/fixtures';

test.describe('Negative e2e', () => {
  test('N1 unknown yard slug shows the 404 page, not a yard', async ({ page, yardPage, notFoundPage }) => {
    await yardPage.goto('/lp/not-a-real-yard-xyz');
    await expect(page).toHaveURL(/\/not-found/);
    await expect(page).toHaveTitle(/404/);
    await expect(notFoundPage.heading).toBeVisible();
    await expect(yardPage.representativesTab).toHaveCount(0);
  });

  test('N2 nonsense search reports no exact matches', async ({ searchPage }) => {
    await searchPage.goto('zzqqxxnotarealthing123');
    await expect(searchPage.noMatchesMessage).toHaveText(/no exact matches found for "zzqqxxnotarealthing123"/i);
    await expect(searchPage.resultsSummary).toHaveCount(0);
  });
});
