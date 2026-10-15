import { test, expect } from '../../helpers/e2e/fixtures';

test.describe('Scenario 1: Locations directory', () => {
  test.beforeEach(async ({ locationsPage }) => {
    await locationsPage.goto();
  });

  test('1.1 heading and intro text', async ({ page, locationsPage }) => {
    await expect(page).toHaveTitle(/locations|auction sites/i);
    await expect(locationsPage.heading).toBeVisible();
    await expect(locationsPage.intro).toBeVisible();
    await expect(locationsPage.intro).toContainText('Ritchie Bros. currently offers over 60 permanent auction sites and local yards');
  });

  test('1.2 satellite-site note is visible', async ({ locationsPage }) => {
    await expect(locationsPage.satelliteNote).toBeVisible();
  });

  test('1.3 country groups', async ({ locationsPage }) => {
    const countries = await locationsPage.countryNames();
    expect(countries.slice(0, 2)).toEqual(['United States', 'Canada']);
    for (const c of ['United States', 'Canada', 'Australia', 'United Kingdom', 'Netherlands', 'UAE']) {
      expect(countries).toContain(c);
    }
    expect(countries.length).toBeGreaterThan(6);
  });

  test('1.4 United States sites', async ({ locationsPage }) => {
    const sites = (await locationsPage.siteTextsFor('United States'));

    expect(sites.length).toBeGreaterThan(20);
    for (const site of ['Phoenix', 'Salt Lake City', 'Houston', 'Las Vegas', 'Atlanta']) {
      expect(sites).toContain(site);
    }
  });

  test('1.5 Canada sites', async ({ locationsPage }) => {
    const sites = (await locationsPage.siteTextsFor('Canada'));

    expect(sites.length).toBeGreaterThan(10);
    for (const site of ['Edmonton', 'Montreal', 'Toronto', 'Regina', 'Saskatoon']) {
      expect(sites).toContain(site);
    }
  });

  test('1.6 satellite vs permanent counts', async ({ locationsPage }) => {
    const allSites = await locationsPage.allSiteTexts();
    const satellite = allSites.filter((s) => s.trim().endsWith('*')).length;
    const permanent = allSites.length - satellite;

    expect(satellite).toBeGreaterThan(15);
    expect(permanent).toBeGreaterThan(25);
    expect(satellite + permanent).toBeGreaterThan(60);
  });

  test('1.7 known satellite and permanent sites', async ({ locationsPage }) => {
    const all = await locationsPage.allSiteTexts();
    expect(all).toContain('San Antonio*');
    expect(all).toContain('Calgary, AB*');
    expect(all).toContain('Phoenix');
    expect(all).toContain('Edmonton');
  });

  test('1.9 switch Auction sites / Local representatives', async ({ locationsPage }) => {
    await expect(locationsPage.auctionSitesToggle).toBeVisible();
    await expect(locationsPage.representativesToggle).toBeVisible();
    await locationsPage.representativesToggle.click();
    await expect(locationsPage.representativesPrompt).toBeVisible();
    await expect(locationsPage.representativesPrompt).toHaveText('Search for representatives', { ignoreCase: true });
  });
});

test.describe('Scenario 2: Open a yard from the directory', () => {
  test('2.1 & 2.2 Edmonton is not marked as satellite and opens its yard page', async ({
    page,
    locationsPage,
    yardPage,
  }) => {
    await locationsPage.goto();
    const edmonton = locationsPage.siteLinksFor('Canada').filter({ hasText: /^Edmonton$/ });
    await test.step('2.1 listed under Canada, no asterisk (exact name match excludes "Edmonton*")', async () => {
      await expect(edmonton).toHaveCount(1);
      await expect(edmonton).toBeVisible();
      expect(await edmonton.innerText()).not.toContain('*');
    })

    await test.step('2.2 click through => page heading id Edmonton', async () => {
      await edmonton.click();
      await expect(page).toHaveURL(/lp\/edmonton-ab/);
      await expect(yardPage.heading).toBeVisible();
    })
  });
});
