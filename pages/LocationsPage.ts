import { Page, Locator, expect } from '@playwright/test';

export class LocationsPage {
  readonly main: Locator;
  readonly heading: Locator;
  readonly intro: Locator;
  readonly satelliteNote: Locator;
  readonly countryHeadings: Locator;
  readonly allSiteLinks: Locator;
  readonly auctionSitesToggle: Locator;
  readonly representativesToggle: Locator;
  readonly representativesPrompt: Locator;

  constructor(private readonly page: Page) {
    this.main = page.getByRole('main');
    this.heading = this.main.getByRole('heading', { level: 1, name: 'Locations' });
    this.intro = this.main.getByRole('paragraph').filter({ hasText: /offers over 60 permanent auction sites/i });
    this.satelliteNote = this.main
      .getByRole('paragraph')
      .filter({ hasText: /satellite sites are represented by an asterisk/i });
    this.countryHeadings = this.main.getByRole('heading', { level: 4 });
    this.allSiteLinks = this.main.getByRole('list').getByRole('link');
    this.auctionSitesToggle = page.getByTestId('auction-sites-tab');
    this.representativesToggle = page.getByTestId('local-representatives-tab');
    this.representativesPrompt = this.main.getByRole('paragraph').filter({ hasText: /search for representatives/i });
  }

  async goto() {
    await this.page.goto('/lp');
    await expect(this.heading).toBeVisible();
  }

  siteLinksFor(country: string): Locator {
    return this.main.getByRole('list', { name: country, exact: true }).getByRole('link');
  }

  async countryNames(): Promise<string[]> {
    return (await this.countryHeadings.allInnerTexts()).map((t) => t.trim());
  }

  async siteTextsFor(country: string): Promise<string[]> {
    return (await this.siteLinksFor(country).allInnerTexts()).map((t) => t.replace(/\*$/, '').trim());
  }

  async allSiteTexts(): Promise<string[]> {
    return (await this.allSiteLinks.allInnerTexts()).map((t) => t.trim());
  }
}
