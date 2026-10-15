import { test as base } from '@playwright/test';
import { LocationsPage } from '../../pages/LocationsPage';
import { NotFoundPage } from '../../pages/NotFoundPage';
import { SearchPage } from '../../pages/SearchPage';
import { YardPage } from '../../pages/YardPage';

export { expect } from '@playwright/test';

interface PageObjects {
  locationsPage: LocationsPage;
  yardPage: YardPage;
  searchPage: SearchPage;
  notFoundPage: NotFoundPage;
}

export const test = base.extend<PageObjects>({
  page: async ({ page }, use) => {
    await page.addLocatorHandler(page.getByRole('button', { name: /i understand/i }), async (button) => {
      await button.click();
    });
    await use(page);
  },
  locationsPage: async ({ page }, use) => use(new LocationsPage(page)),
  yardPage: async ({ page }, use) => use(new YardPage(page)),
  searchPage: async ({ page }, use) => use(new SearchPage(page)),
  notFoundPage: async ({ page }, use) => use(new NotFoundPage(page)),
});
