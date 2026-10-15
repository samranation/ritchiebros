import { Page, Locator, expect } from '@playwright/test';

export class SearchPage {
  readonly cards: Locator;
  readonly titles: Locator;
  readonly locations: Locator;
  readonly closingDates: Locator;
  readonly pagerText: Locator;
  readonly resultsSummary: Locator;
  readonly searchBox: Locator;
  readonly noMatchesMessage: Locator;

  constructor(private readonly page: Page) {
    this.cards = page.locator('[data-testid^="searchResultItemCard-"]');
    this.titles = this.cards.getByTestId('item-card-title-link');
    this.locations = this.cards.locator('p[title]');
    this.closingDates = this.cards.getByTestId('end-date-section');
    this.pagerText = page.locator('#items-per-page');
    this.resultsSummary = page.getByTestId('search-count-header');
    this.searchBox = page.getByTestId('search input');
    this.noMatchesMessage = page.getByTestId('zero-exact-matches-title');
  }

  async goto(freeText: string) {
    await this.page.goto(`/search?freeText=${encodeURIComponent(freeText)}`);
  }

  async waitForResults() {
    await expect(this.cards.first()).toBeVisible();
  }

  async displayedTotal(): Promise<number> {
    const pager = await this.pagerText.innerText();
    return parseInt(pager.split(' of ')[1].replaceAll(',', ''), 10);
  }
}

